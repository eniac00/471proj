import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { DBTables, ErrorMessages, setPBSiteKey } from "@/utils/server";
import { validRegex } from "@/utils/common/validations";
import { AppLinks } from "@/utils/common";

export const load: PageServerLoad = async ({ locals, parent }) => {
    await parent();
    if (locals.user) {
        return redirect(302, "/dashboard");
    }

    if (locals.admin) {
        return redirect(302, "/_");
    }

};

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as {
            email: string,
            username: string,
            name: string,
            password: string,
            passwordConfirm: string,
        } as {
            [key: string]: string;
        };

        Object.keys(data).forEach((key: string) => {
            if (data[key]) {
                data[key] = data[key].trim();
            }
        }); // DEBUG



        const { email, username, name, password, passwordConfirm } = data;

        // // @request.headers.x_site_key="01HPV38C41AYV5KA6BGJJEWHBK"
        console.log(email, password); // DEBUG, this is illigal :3 :D

        // Trim all



        // if (!email || !password) return fail(400, { message: ErrorMessages.ALL_FIELDS_REQUIRED });
        if (!email || !username || !name || !password || !passwordConfirm) return fail(400, { message: ErrorMessages.ALL_FIELDS_REQUIRED });

        /** Stuff Validations */
        const fieldErrors = {
            email: "",
            username: "",
            name: "",
            password: "",
            passwordConfirm: "",
        }

        validRegex.username.test(username) || (fieldErrors.username = ErrorMessages.USERNAME_INVALID);
        validRegex.name.test(name) || (fieldErrors.name = ErrorMessages.NAME_INVALID);
        validRegex.email.test(email) || (fieldErrors.email = ErrorMessages.EMAIL_INVALID);
        validRegex.password.test(password) || (fieldErrors.password = ErrorMessages.PASSWORD_INVALID);
        password === passwordConfirm || (fieldErrors.passwordConfirm = ErrorMessages.PASSWORD_CONFIRM_INVALID);

        if (fieldErrors.email || fieldErrors.username || fieldErrors.name || fieldErrors.password || fieldErrors.passwordConfirm) {
            console.log(fieldErrors); // DEBUG
            return fail(400, { fieldErrors });
        }




        // Validations from server

        setPBSiteKey(locals.pb); // To tell pb that this is from web app


        // Check if email exists in database
        const userWithEmail = await locals.pb.collection(DBTables.users).getFirstListItem(`email = "${email}"`).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        const userWithUsername = await locals.pb.collection(DBTables.users).getFirstListItem(`username = "${username}"`).catch((e) => {
            // console.log(e); // DEBUG
            return null;
        });

        if (userWithEmail) {
            fieldErrors.email = ErrorMessages.EMAIL_EXISTS;
        }
        if (userWithUsername) {
            fieldErrors.username = ErrorMessages.USERNAME_EXISTS;
        }

        if (fieldErrors.email || fieldErrors.username) {
            console.log(fieldErrors); // DEBUG
            return fail(400, { fieldErrors });
        }

        // Create user
        const newUser = await locals.pb.collection(DBTables.users).create({
            username,
            email,
            name,
            password,
            passwordConfirm,
            emailVisibility: true,
        })

        if (!newUser) {
            return fail(400, { message: "Failed to create user" });
        }


        return redirect(302, AppLinks.USER_LOGIN);




    }
};