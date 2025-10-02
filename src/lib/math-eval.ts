// A simple math expression evaluator that respects operator precedence and parentheses.
// It uses a simplified version of the Shunting-yard algorithm.

const precedence: { [key: string]: number } = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '^': 3,
};

const applyOp = (operators: string[], values: number[]): void => {
  const operator = operators.pop();
  const right = values.pop();
  const left = values.pop();

  if (operator === undefined || right === undefined || left === undefined) {
    throw new Error('Invalid expression');
  }

  switch (operator) {
    case '+':
      values.push(left + right);
      break;
    case '-':
      values.push(left - right);
      break;
    case '*':
      values.push(left * right);
      break;
    case '/':
      if (right === 0) throw new Error('Division by zero');
      values.push(left / right);
      break;
    case '^':
      values.push(Math.pow(left, right));
      break;
  }
};


const factorial = (n: number): number => {
    if (n < 0) throw new Error("Factorial not defined for negative numbers");
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


export const evaluateExpression = (expression: string): number => {
  // Pre-process for functions and clean up
  let tokens = expression
    .replace(/\s+/g, '')
    .replace(/(\d+)!/g, 'fact($1)') // convert n! to fact(n)
    .split(/([+\-*/^()])/);


  const values: number[] = [];
  const operators: string[] = [];

  const functionStack: { name: string, argCount: number }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (!isNaN(parseFloat(token))) {
      values.push(parseFloat(token));
    } else if (token in functions) {
        operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators[operators.length - 1] !== '(') {
        if (operators.length === 0) throw new Error("Mismatched parentheses");
        applyOp(operators, values);
      }
      operators.pop(); // Pop '('.

      // Check if the '(' was part of a function call
      const lastOp = operators[operators.length - 1];
      if (lastOp in functions) {
          const funcName = operators.pop() as string;
          const arg = values.pop();
          if (arg === undefined) throw new Error(`Argument missing for function ${funcName}`);
          values.push(functions[funcName](arg));
      }
    } else if (token in precedence) {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] in precedence &&
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
    throw new Error('Invalid expression');
  }

  return values[0];
};
