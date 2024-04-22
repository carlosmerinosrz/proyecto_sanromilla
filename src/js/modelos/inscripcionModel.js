"use strict" //activo modo estricto

/**
 * Clase Inscripcion para crear inscripciones a partir de ella
 */
export class InscripcionModel {
    constructor(nombre, apellidos, genero, fechaNac, categoria, precioDorsal, dni, telefono, infoAdicional, estadoPago) {
        this.nombre = nombre
        this.apellidos = apellidos
        this.genero = genero
        this.fechaNac = fechaNac
        this.categoria = categoria
        this.precioDorsal = precioDorsal
        this.dni = dni
        this.telefono = telefono
        this.infoAdicional = infoAdicional
        this.estadoPago = estadoPago
    }
}
