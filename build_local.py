import os
import re

FRONTEND_DIR = 'Frontend'
DIST_DIR = 'dist'

if not os.path.exists(DIST_DIR):
    os.makedirs(DIST_DIR)

def read_file(filename):
    path = os.path.join(FRONTEND_DIR, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""

def process_includes(content):
    # Regex to match <?!= include('Filename'); ?>
    pattern = re.compile(r'<\?!= include\([\'"]([^\'"]+)[\'"]\);\s*\?>')
    
    def replacer(match):
        filename = match.group(1) + '.html'
        return read_file(filename)
        
    return pattern.sub(replacer, content)

def process_script_url(content):
    # Replace <?= getScriptUrl() ?>?page=Login with Login.html
    pattern = re.compile(r'<\?= getScriptUrl\(\) \?>\?page=([a-zA-Z0-9_]+)')
    def replacer(match):
        return match.group(1) + '.html'
    return pattern.sub(replacer, content)

# Files to build
pages = ['Landing.html', 'Login.html', 'Estudiante.html', 'Arrendador.html', 'Administrador.html']

for page in pages:
    content = read_file(page)
    if content:
        content = process_includes(content)
        content = process_script_url(content)
        
        # Add a google script mock if it doesn't exist
        mock_script = """
<script>
// Mock Google Script Run for local dev
if (typeof google === 'undefined') {
    window.google = {
        script: {
            run: {
                withSuccessHandler: function(cb) {
                    this.successCb = cb;
                    return this;
                },
                withFailureHandler: function(cb) {
                    this.failureCb = cb;
                    return this;
                },
                loginUser: function(role, email, password) {
                    setTimeout(() => {
                        if (email === 'arrendador@test.com' && password === '123') {
                            this.successCb({success: true, user: {Email: email, NombreCompleto: 'Arrendador Falso', ArrendadorID: 'A1'}});
                        } else if (email === 'estudiante@test.com' && password === '123') {
                            this.successCb({success: true, user: {CorreoInstitucional: email, NombreCompleto: 'Estudiante Falso', EstudianteID: 'E1'}});
                        } else {
                            this.successCb({success: false, message: 'Credenciales inválidas'});
                        }
                    }, 500);
                    return this;
                },
                getHospedajes: function() {
                    setTimeout(() => {
                        this.successCb([
                            {HospedajeID: 'H1', Titulo: 'Cuarto de prueba', Distrito: 'Wanchaq', PrecioMensual: 500, Servicios: 'Wi-Fi,Baño Privado', Estado: 'Disponible'}
                        ]);
                    }, 500);
                    return this;
                },
                misHabitaciones: function(id) {
                    setTimeout(() => { this.successCb([]); }, 500);
                    return this;
                },
                getReservasPorEstudiante: function(id) {
                    setTimeout(() => { this.successCb([
                        {ReservaID: 'RES-1234', Titulo: 'Cuarto Céntrico', Estado: 'Confirmada', Monto: 450, FechaReserva: '12/05/2026'}
                    ]); }, 500);
                    return this;
                },
                getReservasPorArrendador: function(id) {
                    setTimeout(() => { this.successCb([
                        {ReservaID: 'RES-9999', Titulo: 'Habitación Premium', Estado: 'Activa', Monto: 500, FechaReserva: 'Hoy', EstudianteNombre: 'María López'}
                    ]); }, 500);
                    return this;
                },
                getMensajesPorUsuario: function(id) {
                    setTimeout(() => { this.successCb([
                        {MensajeID: 'M1', NombreRemitente: 'Arrendador Juan', FechaHora: 'Hoy 10:00 AM', Mensaje: 'Hola, la habitación sigue disponible.'},
                        {MensajeID: 'M2', NombreRemitente: 'María López', FechaHora: 'Hoy 10:05 AM', Mensaje: '¡Hola! He reservado tu habitación: Habitación Premium. ¡Quedo atento a tus indicaciones!'}
                    ]); }, 500);
                    return this;
                },
                enviarMensaje: function(remitenteId, receptorId, hospedajeId, mensaje) {
                    setTimeout(() => { this.successCb({success: true}); }, 500);
                    return this;
                },
                getRoommates: function() {
                    setTimeout(() => { this.successCb([
                        {NombreCompleto: 'Carlos Ruiz', Universidad: 'U. Andina', Carrera: 'Ing. Sistemas', Intereses: 'Deportes, Videojuegos'}
                    ]); }, 500);
                    return this;
                }
            }
        }
    };
}
</script>
"""
        # Inject mock just before </body>
        content = content.replace('</body>', mock_script + '\n</body>')

        with open(os.path.join(DIST_DIR, page), 'w', encoding='utf-8') as f:
            f.write(content)

# Create index.html that redirects to Landing or lets you choose
index_content = """
<!DOCTYPE html>
<html>
<head>
    <title>Local Dev Server</title>
    <style>body { font-family: sans-serif; padding: 50px; text-align: center; }</style>
</head>
<body>
    <h1>CuscoRent Local Dev</h1>
    <p><a href="Landing.html">Ir a Landing Page</a></p>
    <p><a href="Login.html">Ir a Login</a></p>
    <hr>
    <h3>Credenciales de prueba:</h3>
    <p>Estudiante: estudiante@test.com / 123</p>
    <p>Arrendador: arrendador@test.com / 123</p>
</body>
</html>
"""
with open(os.path.join(DIST_DIR, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(index_content)

print('Local build completed in dist/ directory.')
