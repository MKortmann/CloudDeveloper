import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt} from 'sequelize-typescript';

// A Model is a class that extends Sequelize.Model. It tells sequelize to expect a table name User. In the database with the fields including a primary key, and four columns: email, password, createdAt and updateAt.
// In fact, sequelize also defines by default the fields: id, createdAt and updateAt. However, when we create a class that extends sequelize model, the id, and createdAt and UpdatedAt will not be created by default.

@Table
export class User extends Model<User> {

  @PrimaryKey
  @Column
  public email!: string;

  @Column
  public password_hash!: string; // for nullable fields

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  short() {
    return {
      email: this.email
    }
  }
}
