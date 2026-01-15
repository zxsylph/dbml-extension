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

    // Helper to find matching bracket and check if it contains comma
    const checkArrayMultiline = (startIdx: number): boolean => {
        let depth = 1;
        let hasComma = false;
        for (let i = startIdx + 1; i < tokens.length; i++) {
            if (tokens[i].type === TokenType.Symbol && tokens[i].value === '[') depth++;
            if (tokens[i].type === TokenType.Symbol && tokens[i].value === ']') depth--;
            
            if (depth === 1 && tokens[i].type === TokenType.Symbol && tokens[i].value === ',') {
                hasComma = true;
            }
            
            if (depth === 0) return hasComma;
        }
        return false;
    };

    const multilineArrayStack: boolean[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const next = i < tokens.length - 1 ? tokens[i + 1] : null;

        // Skip whitespace tokens completely for logic, handle spacing manually based on context
        // BUT we need to respect paragraph breaks (empty lines) from original source
        if (token.type === TokenType.Whitespace) {
            const newlines = (token.value.match(/\n/g) || []).length;
            if (newlines > 0) {
                const toPrint = Math.min(newlines, 2); 
                // Determine if we should append newlines
                if (!output.endsWith('\n')) {
                    output += '\n'.repeat(toPrint);
                } else {
                    // Already have at least one newline
                    if (toPrint > 1 && !output.endsWith('\n\n')) {
                        output += '\n';
                    }
                }
            }
            continue;
        }

        // Before printing token, handle required spacing/indentation
        
        // Ensure indentation if we are at start of a line
        if (output.endsWith('\n')) {
             // Exception: if token is '}', we decrease indent before printing, handled in switch
             if (token.value !== '}') {
                output += getIndent();
             }
        } else if (output.length > 0) {
            // Logic for space between tokens
            // Default: add space if prev wasn't space/newline and we are not in special no-space case
            let needsSpace = true;
            
            const lastChar = output[output.length - 1];
            if (lastChar === ' ' || lastChar === '\n' || lastChar === '(' || lastChar === '[' || lastChar === '.') {
                needsSpace = false;
            }
            
            if (token.type === TokenType.Symbol) {
                 if (token.value === ',' || token.value === ']' || token.value === ')' || token.value === '.' || token.value === ':') {
                     needsSpace = false;
                 }
                 // Special case: Ref: > or < or -
                 if (['<', '>', '-'].includes(token.value)) {
                     // Ensure space before
                     // handled by default needsSpace=true
                 }
            }

            if (needsSpace) {
                output += ' ';
            }
        }

        switch (token.type) {
            case TokenType.Symbol:
                if (token.value === '{') {
                    output += '{';
                    output += '\n';
                    indentLevel++;
                    // Force next token to start on new line/indent
                    // (Loop will handle indent via output.endsWith('\n') check)
                } else if (token.value === '}') {
                    // Decrease indent before printing
                    if (!output.endsWith('\n')) {
                        output += '\n';
                    }
                    indentLevel--;
                    
                    if (output.endsWith('\n')) {
                        output += getIndent();
                    }
                    output += '}';
                } else if (token.value === '[') {
                    const isMultiline = checkArrayMultiline(i);
                    multilineArrayStack.push(isMultiline);
                    
                    output += '[';
                    if (isMultiline) {
                        output += '\n';
                        indentLevel++;
                    }
                } else if (token.value === ']') {
                    const isMultiline = multilineArrayStack.pop();
                    
                    if (isMultiline) {
                        if (!output.endsWith('\n')) {
                            output += '\n';
                        }
                        indentLevel--;
                        if (output.endsWith('\n')) {
                            output += getIndent();
                        }
                    }
                    output += ']';
                } else if (token.value === ',') {
                    output += ',';
                    // If inside multiline array, append newline
                    const currentMultiline = multilineArrayStack.length > 0 && multilineArrayStack[multilineArrayStack.length - 1];
                    if (currentMultiline) {
                        output += '\n';
                    }
                } else {
                    output += token.value;
                }
                break;

            case TokenType.String:
                let val = token.value;
                // Rule: Datatype for field always use double qoute
                // We assume this means all string literals.
                if (val.startsWith("'") && !val.startsWith("'''")) {
                    const content = val.slice(1, -1);
                    // Escape double quotes inside
                    const escaped = content.replace(/"/g, '\\"');
                    val = `"${escaped}"`;
                }
                output += val;
                break;

            case TokenType.Word:
            case TokenType.Unknown:
            case TokenType.Comment:
                // Special handling for Comment: if line comment, ensure newline after?
                // Tokenizer for Comment includes `// ...`.
                // If it is `//`, it usually signifies rest of line.
                // We should ensure next thing is on newline.
                output += token.value;
                break;
        }
    }

    return output.trim() + '\n';
}
