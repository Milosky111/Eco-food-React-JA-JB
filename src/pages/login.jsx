import { useState } from 'react';
function Login() {
const [correo, setCorreo] = useState('');
const [password, setPassword] = useState('');
const manejarSubmit = (e) => {
e.preventDefault();
if (correo.trim() === '' || password.trim() === '') {
alert('Debes completar ambos campos.');
return;
}
alert('Inicio de sesión exitoso');
};
return (
<div className="container mt-5">
<h2>Iniciar Sesión</h2>
<form onSubmit={manejarSubmit}>
<div className="mb-3">
<label className="form-label">Correo electrónico</label>
<input
type="email"
className="form-control"
value={correo}
onChange={(e) => setCorreo(e.target.value)}
required
/>
</div>
<div className="mb-3">
<label className="form-label">Contraseña</label>
<input
type="password"
className="form-control"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
</div>
<button type="submit" className="btn btn-primary">
Iniciar Sesión
</button>
</form>
</div>
);
}
export default Login;
