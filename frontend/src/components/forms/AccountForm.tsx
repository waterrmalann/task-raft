import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@components/ui/input"

// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import useEditUserMutation from "@hooks/user/useEditUserMutation"
import useUser from "@hooks/user/useUser"

const accountFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    mfa: z.boolean().default(false).optional(),
    email_notifications: z.boolean().default(false).optional()
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {

    const editUserDataMutation = useEditUserMutation();
    const userQuery = useUser();

    const defaultValues: Partial<AccountFormValues> = {
        name: userQuery?.data?.name || "",
        mfa: userQuery?.data?.preferences.mfa || false,
        email_notifications: userQuery?.data?.preferences.emailNotifications || false,
    }
    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })

    function onSubmit(data: AccountFormValues) {
        const preferences: { emailNotifications?: boolean; mfa?: boolean } = {};

        if (data.email_notifications !== undefined) {
            preferences.emailNotifications = data.email_notifications;
        }

        if (data.mfa !== undefined) {
            preferences.mfa = data.mfa;
        }

        editUserDataMutation.mutate({
            name: data.name,
            preferences
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed on your profile and in
                                emails.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="mfa"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    2 Factor Authentication
                                </FormLabel>
                                <FormDescription>
                                    Enable multi-factor authentication via email when logging in.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email_notifications"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Email Notifications
                                </FormLabel>
                                <FormDescription>
                                    Receive emails about your account activity.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit">Update account</Button>
            </form>
        </Form>
    )
}