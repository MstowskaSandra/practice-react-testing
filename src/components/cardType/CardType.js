import React, { useState } from 'react';

const CardType = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const luhnCheck = (number) => {
    const digits = number.replace(/\D/g, '').split('').reverse();
    let sum = 0;
    let isEven = false;

    for (let digit of digits) {
      let n = parseInt(digit);
      if (isEven) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const detectCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6/.test(cleaned)) return 'Discover';
    
    return 'Unknown';
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(value);
    setError('');

    if (!value) {
      setCardType('');
      setIsValid(false);
      return;
    }

    const type = detectCardType(value);
    setCardType(type);

    if (value.length < 13 || value.length > 19) {
      setIsValid(false);
      setError('13-19 cyfr');
      return;
    }

    const valid = luhnCheck(value);
    setIsValid(valid);
    if (!valid) setError('Nieprawidłowy numer (Luhn)');
  };

  return (
    <section>
      <h1>Karta Płatnicza</h1>
      <label>
        Numer karty:
        <input 
          value={cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          data-testid="card-input"
        />
      </label>
      
      {cardType && <div data-testid="card-type">Typ: {cardType}</div>}
      {error && <div data-testid="error" className="error">{error}</div>}
      {isValid && <div data-testid="valid">✅ OK</div>}
    </section>
  );
};

export default CardType;

