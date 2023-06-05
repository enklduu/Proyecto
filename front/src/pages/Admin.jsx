import React, { useState } from 'react';
// import ProductForm from '../components/ProductForm'; // Crear productos
// import CategoryForm from '../components/CategoryForm'; // Crear categorias
// import UserForm from '../components/UserForm'; // editar usuarios
// import ProductEditForm from '../components/ProductEditForm'; // editar categoria en productos , 

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  let componentToDisplay;
  if (selectedOption === 'option1') {
    componentToDisplay = "Componente1";
  } else if (selectedOption === 'option2') {
    componentToDisplay = "Componente2";
  } else if (selectedOption === 'option3') {
    componentToDisplay = "Componente13";
  }

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="option1"
            checked={selectedOption === 'option1'}
            onChange={() => handleOptionChange('option1')}
          />
          Option 1
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="option2"
            checked={selectedOption === 'option2'}
            onChange={() => handleOptionChange('option2')}
          />
          Option 2
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="option3"
            checked={selectedOption === 'option3'}
            onChange={() => handleOptionChange('option3')}
          />
          Option 3
        </label>
      </div>
      <div>{componentToDisplay}</div>
    </div>
  );
};

export default Admin;
