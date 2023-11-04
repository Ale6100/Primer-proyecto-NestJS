export class CreateMailDto {
    from: string;
    to: string;
    subject: string;
    html: string;
    attachments: {
        filename: string;
        path: string;
    }[];
}
