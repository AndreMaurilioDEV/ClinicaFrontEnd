import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {

  const [form, setForm] = useState({
    userAdmin: "",
    passwordAdmin: ""
  });

  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const {name: targetName, value} = target;
    setForm({...form, [targetName]: value})
  };

  const {userAdmin, passwordAdmin} = form;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard");
  };


  return (
    <section>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
        <label htmlFor="user-inp">
      <input 
      type="text"
      name="user"
      value={userAdmin}
      onChange={ handleChange }
      id="user-inp" 
      />
    </label>

    <label htmlFor="password-inp">
      <input 
      type="password"
      name="password"
      value={passwordAdmin}
      onChange={ handleChange }
      id="password-inp" 
      />
    </label>

    <button
    onClick={ handleClick }
    type="submit"
    disabled={form.passwordAdmin.length == 0}
    >
      ENTRAR
    </button>
        </form>
      </div>
    </section>
  )
};

export default AdminPage;