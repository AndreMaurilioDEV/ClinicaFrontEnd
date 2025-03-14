import { useState } from "react";
import React from 'react';

function AlterarSenha() {

  const [formPassword, setFormPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {name: targetName, value} = target;
    setFormPassword({...formPassword, [targetName]: value})
  };

  return (
    <>
    <section>
      <form onSubmit={(e) => 
        e.preventDefault()
      }>
        <label htmlFor="user-inp">
      <span className="span-input">Senha Atual:</span>
      <input 
      type="password"
      name="oldPassword"
      value={formPassword.oldPassword}
      onChange={ handleChange }
      id="user-inp" 
      />
    </label>

    <label htmlFor="password-inp">
      <span className="span-input">Nova Senha:</span>
      <input 
      type="password"
      name="newPassword"
      value={formPassword.newPassword}
      onChange={ handleChange }
      id="password-inp" 
      />
    </label>

    <button
    disabled={formPassword.oldPassword.length == 0}
    >
      Confirmar
    </button>
      </form>
    </section>
    </>
  )

};

export default AlterarSenha;