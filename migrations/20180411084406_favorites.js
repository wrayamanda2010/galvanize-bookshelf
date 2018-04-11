
exports.up = (knex, Promise) => {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary()
    table.integer('user_id').notNull().references('users.id').onDelete('CASCADE')
    table.integer('book_id').notNull().references('books.id').onDelete('CASCADE')
    table.dateTime('created_at').notNull().defaultTo(knex.raw('now()'))
    table.dateTime('updated_at').notNull().defaultTo(knex.raw('now()'))
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites')
};
