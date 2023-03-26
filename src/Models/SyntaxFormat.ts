/**
 * Get the syntax class for the given word for the pseudocode language
 * @param word The word to get the syntax class for
 */
export function getSyntaxClass(word: string): string {
    const keywords = ["algorithm", "for", "do", "while", "if", "else", "return", "then", "to", "swap"];
    const operators = ["<-", "=", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "!", "+", "-", "*", "/", "%"];
    const types = ["int", "float", "double", "string", "char", "boolean", "void"];
    const constants = ["true", "false", "null"];

    if (keywords.includes(word)) {
        return "keyword";
    }  else if (operators.includes(word)) {
        return "operator";
    }
    else {
        return "text";
    }
}