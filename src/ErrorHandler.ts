import PrettyError from 'pretty-error'

export default class ErrorHandler
{
    prettyError: PrettyError;

    constructor() {
        this.prettyError = new PrettyError();
    }

    render(error: Error) {
        /* Render the error pretty */
        this.prettyError.render(error, true, true);
    }
}