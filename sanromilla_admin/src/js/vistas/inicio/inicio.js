"use strict" //activo modo estricto

/**
 * Clase inicio de Admin
 */
export class Inicio{

    constructor (controlador) {
        this.controlador=controlador
        window.setTimeout(this.iniciar.bind(this), 500)
        window.onerror = function (error) { console.log('Error capturado. ' + error) }
    }

    /**
     Inicia el login.
     Se llama al cargar la página.
     **/
    iniciar () {
        // Login con Google
        google.accounts.id.initialize({
            client_id: '465362912048-5jasakkolgeib7hebu2rfbgmflbmb3ot.apps.googleusercontent.com',
            callback: this.login.bind(this)
        })
        google.accounts.id.renderButton(
            document.getElementById('divGoogleLogin'),
            { theme: 'outline', size: 'large' } // customization attributes
        )

    }

    /**
     Recoge los datos y los envía al servidor para identificar al usuarioRecibe el token del login con Google y lo envía al servidor para identificar al usuario.
     @param token {Object} Token de identificación de usuario de Google.
     **/
     login (token) {
        this.controlador.loginGoogle(token.credential)
            .then(tokenSesion => {
                sessionStorage.setItem('token', tokenSesion)
                let datosToken= JSON.parse (atob (tokenSesion.split('.')[1]));
    
                // Enviar el token al servidor
                fetch('php/guardar_token.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: tokenSesion })
                }).then(response => response.json())
                  .then(data => {
                      if (data.success) {
                          Swal.fire({
                              title: 'Login realizado con éxito',
                              text: 'Bienvenido, ' + datosToken.nombre,
                              icon: 'success',
                              confirmButtonText: 'Aceptar'
                          }).then((result) => {
                              this.controlador.mostrarHome();
                          })
                      } else {
                          Swal.fire({
                              title: 'Error',
                              text: 'No se pudo guardar el token en el servidor.',
                              icon: 'error',
                              confirmButtonText: 'Aceptar'
                          });
                      }
                  });
    
            })
            .catch(e => {
                Swal.fire({
                    title: 'Usuario no válido',
                    text: 'Usuario sin acceso a la aplicación.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            })
    }
    

}