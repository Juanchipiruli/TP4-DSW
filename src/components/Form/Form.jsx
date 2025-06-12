
import { useState } from 'react';
import './Form.css';

export const Form = ({ fields, onSubmit, submitText = 'Enviar' }) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        {fields.map(field => (
          <div key={field.name} className='fieldmaicogay'>
            <label htmlFor={field.name}>{field.label}:</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}
        <button type="submit">{submitText}</button>
      </fieldset>
      
    </form>
  );
};