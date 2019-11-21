var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        user: { type: String,
                lowercase: true,
                trim: true, 
                required: [true, "É requerido um nome de usuário."],
                unique: [true, "Usuário deve ser único"]
            },
        mail: { type: String,
                required: [true, "É obrigatório o uso de e-email."],
                unique: [true, "E-mail já cadastrado."]
        },
        pass: { type: String, 
                required: [true, "Defina um senha."],
                min: [6, "Use ao menos 6 caracteres."],
                max: 12
            },
        friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
    }
);

module.exports = mongoose.model('User', UserSchema);