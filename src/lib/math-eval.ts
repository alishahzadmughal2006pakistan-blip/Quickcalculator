// A simple math expression evaluator that respects operator precedence and parentheses.
// It uses a simplified version of the Shunting-yard algorithm.

const precedence: { [key: string]: number } = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) throw new Error("Factorial not defined for non-integers or negative numbers");
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

const functions: { [key: string]: (n: number) => number } = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    log: Math.log10,
    ln: Math.log,
    sqrt: Math.sqrt,
    fact: factorial,
};


const applyOp = (operators: string[], values: number[]): void => {
  const op = operators.pop();
  if (op === undefined) throw new Error('Invalid expression: Operator expected.');
  
  if (op in functions) {
    const arg = values.pop();
    if (arg === undefined) throw new Error(`Invalid expression: Argument missing for ${op}.`);
    values.push(functions[op](arg));
  } else {
    const right = values.pop();
    const left = values.pop();

    if (right === undefined || left === undefined) {
      throw new Error('Invalid expression: Operand missing.');
    }

    switch (op) {
      case '+': values.push(left + right); break;
      case '-': values.push(left - right); break;
      case '*': values.push(left * right); break;
      case '/':
        if (right === 0) throw new Error('Division by zero');
        values.push(left / right);
        break;
      case '^': values.push(Math.pow(left, right)); break;
      default: throw new Error(`Unknown operator: ${op}`);
    }
  }
};


export const evaluateExpression = (expression: string): number => {
    // Standardize function calls e.g. sqrt(9) not sqrt 9
    let processedExpression = expression.replace(/(\w+)\s*\(([^)]*)\)/g, '$1($2)');

    // Tokenize, keeping numbers, operators, and parentheses
    const tokens = processedExpression.match(/(\d+\.?\d*|\.\d+|[+\-*/^()]|\w+)/g);
    if (!tokens) throw new Error("Invalid characters in expression");

    const values: number[] = [];
    const operators: string[] = [];

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (!isNaN(parseFloat(token))) {
            values.push(parseFloat(token));
        } else if (token in functions) {
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                applyOp(operators, values);
            }
            if (operators.length === 0) throw new Error("Mismatched parentheses");
            operators.pop(); // Pop '('

            // If the op before '(' was a function, apply it
            if (operators.length > 0 && operators[operators.length - 1] in functions) {
                applyOp(operators, values);
            }
        } else if (token in precedence) {
            while (
                operators.length > 0 &&
                operators[operators.length - 1] !== '(' &&
                precedence[operators[operators.length - 1]] >= precedence[token]
            ) {
                applyOp(operators, values);
            }
            operators.push(token);
        } else {
            throw new Error(`Unknown token: ${token}`);
        }
    }

    while (operators.length > 0) {
        if (operators[operators.length - 1] === '(') throw new Error("Mismatched parentheses");
        applyOp(operators, values);
    }

    if (values.length !== 1 || operators.length !== 0) {
        throw new Error('Invalid expression format');
    }

    return values[0];
};
