"use strict" //activo modo estricto

/**
 * Clase de Inscripción 
 */
export class InscripcionModel {
    constructor(nombre, apellidos, genero, fechaNac, categoria, precioDorsal, camiseta, dni, email, telefono, infoAdicional) {
        this.nombre = nombre
        this.apellidos = apellidos
        this.genero = genero
        this.fechaNac = fechaNac
        this.categoria = categoria
        this.precioDorsal = precioDorsal
        this.camiseta = camiseta
        this.dni = dni
        this.email = email
        this.telefono = telefono
        this.infoAdicional = infoAdicional
    }
}
