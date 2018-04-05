exports.up = function(knex, Promise) {
    return knex.schema.createTable('books', function(table){
      table.increments()
      table.string('title',255).notNullable().defaultTo('')
      table.string('author',255).notNullable().defaultTo('')
      table.string('genre',255).notNullable().defaultTo('')
      table.text('description').notNullable().defaultTo('')
      table.text('cover_url').notNullable().defaultTo('')
      table.dateTime('created_at').notNullable().defaultTo(knex.raw('now()'))
      table.dateTime('updated_at').notNullable().defaultTo(knex.raw('now()'))
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('books')
};
