const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true
    },
    precio: {   
        type: Number,
        default: 0
    },  
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',   
        required: true
    },
    descripcion: {  
        type: String,
    },
    disponible: {           
        type: Boolean,
        default: true
    },
    estado: {   
        type: Boolean,  
        required: true,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,    
        ref: 'Usuario',
        required: true
    },
    img: {  
        type: String,
    }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, _id, ...data } = this.toObject();  
    // data.uid = _id;
    return data;
}

module.exports = model('Producto', ProductoSchema);