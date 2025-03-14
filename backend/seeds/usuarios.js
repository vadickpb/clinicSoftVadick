/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('usuarios').del() // Borra los datos existentes
      .then(() => {
          return knex('usuarios').insert([
              { nombre: 'Admin', apellido: 'admin', email: 'admin@example.com', password: 'hashed_password' },
              { nombre: 'Usuario1', apellido: 'Usuario1' ,email: 'usuario1@example.com', password: 'hashed_password' }
          ]);
      });
};
