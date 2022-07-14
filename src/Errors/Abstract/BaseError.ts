export default abstract class BaseError extends Error
{
    reply?: string;

    constructor(message?: string, reply: boolean|string = false) {
        super(message);

        if (typeof reply === 'string') {
            this.reply = reply;
        } else if (reply === true) {
            this.reply = this.message;
        }
    }
}