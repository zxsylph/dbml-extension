import { Token, TokenType, tokenize } from './tokenizer';

export interface FormatterOptions {
    indentSize?: number;
    useTabs?: boolean;
}

export function format(input: string, options: FormatterOptions = {}): string {
    const tokens = tokenize(input);
    const indentSize = options.indentSize || 2;
    const indentChar = options.useTabs ? '\t' : ' ';
    const oneIndent = indentChar.repeat(indentSize);

    let output = '';
    let indentLevel = 0;
    
    // Helper to get current indentation string
    const getIndent = () => oneIndent.repeat(Math.max(0, indentLevel));

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const prev = i > 0 ? tokens[i - 1] : null;
        const next = i < tokens.length - 1 ? tokens[i + 1] : null;

        // Skip tokens we want to effectively "eat" or handle via previous/next logic, 
        // though usually we handle them in place. This loop processes current token.

        switch (token.type) {
            case TokenType.Whitespace:
                // Handle newlines
                const newlines = (token.value.match(/\n/g) || []).length;
                if (newlines > 0) {
                    // Max 2 consecutive newlines (1 empty line)
                    const toPrint = Math.min(newlines, 2); 
                    output += '\n'.repeat(toPrint);
                    
                    // If the NEXT token is NOT a newline or end of file, we apply indentation
                    // But we must check if the next token is '}' which reduces indentation
                    if (next && next.type === TokenType.Symbol && next.value === '}') {
                        output += oneIndent.repeat(Math.max(0, indentLevel - 1));
                    } else if (next) {
                        output += getIndent();
                    }
                } else {
                    // Just spaces/tabs within a line
                    // We might want to collapse to single space, unless it's aligning something?
                    // For now, collapse to single space if it's not empty string
                     if (token.value.length > 0) {
                         // Check special case: if previous was '{', we might want a newline instead of space
                         // But usually '{' is followed by newline in our logic below.
                         
                         // If prev was ':', we want a space.
                         // If next is ']', we might NOT want a space if prev was something else? 
                         // Let's stick to simple: output one space.
                         // BUT, don't output space if output ends with newline
                         if (output.length > 0 && !output.endsWith('\n') && !output.endsWith(' ')) {
                             output += ' ';
                         }
                     }
                }
                break;

            case TokenType.Symbol:
                if (token.value === '{') {
                    // Space before { if not start of line
                    if (output.length > 0 && !output.endsWith('\n') && !output.endsWith(' ')) {
                        output += ' ';
                    }
                    output += '{';
                    indentLevel++;
                    // If next is NOT a newline (or whitespace containing newline), force one
                    const nextHasNewline = next && next.type === TokenType.Whitespace && next.value.includes('\n');
                    if (!nextHasNewline) {
                        output += '\n' + getIndent();
                    }
                } else if (token.value === '}') {
                     if (!output.endsWith('\n') && !output.endsWith(getIndent()) && prev && prev.type !== TokenType.Whitespace) {
                         output += '\n';
                         indentLevel--; 
                         output += getIndent(); 
                         indentLevel++; 
                     }
                     output += '}';
                     indentLevel--; 
                } else if (token.value === ':') {
                     output += ':';
                     if (next && next.type !== TokenType.Whitespace && next.type !== TokenType.Symbol) {
                         output += ' ';
                     }
                } else if (token.value === ',') {
                     output += ',';
                     // Space after comma
                     output += ' ';
                } else if (token.value === '[') {
                    // Space before [ if not after newline
                    if (output.length > 0 && !output.endsWith('\n') && !output.endsWith(' ')) {
                        output += ' ';
                    }
                    output += '[';
                } else {
                    // Other symbols like . > - <
                    // Some need spaces, some don't.
                    if (['>', '<', '-'].includes(token.value)) {
                         // Space before?
                         if (output.length > 0 && !output.endsWith(' ') && !output.endsWith('\n')) {
                            output += ' ';
                         }
                         output += token.value;
                         // Space after?
                         if (next && next.type !== TokenType.Whitespace) {
                            output += ' ';
                         }
                    } else {
                        output += token.value;
                    }
                }
                break;

            case TokenType.Comment:
                // Comments should just be appended.
                // If it's a line comment `//`, it extends to newline.
                // We should ensure space before it if it's on the same line as code
                if (token.value.startsWith('//')) {
                     if (output.length > 0 && !output.endsWith('\n') && !output.endsWith(' ')) {
                         output += ' ';
                     }
                }
                output += token.value;
                break;
            
            case TokenType.String:
            case TokenType.Word:
            case TokenType.Unknown:
                // Just append
                // Ensure separation if prev was Word? `intpk` -> `int pk`
                if (prev && (prev.type === TokenType.Word || prev.type === TokenType.String) && !output.endsWith(' ') && !output.endsWith('\n')) {
                    output += ' ';
                }
                output += token.value;
                break;
        }
    }

    return output.trim() + '\n';
}
