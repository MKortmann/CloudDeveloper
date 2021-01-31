import {Table, Column, Model, HasMany, PrimaryKey, CreatedAt, UpdatedAt, ForeignKey} from 'sequelize-typescript';
import { User } from '../../users/models/User';

// we use here sequilize decorators to declare that this
// model will correspond to a table in our postgress server

@Table
export class FeedItem extends Model<FeedItem> {
  // declare that the instance variable caption correspont to a specific column has the type string
  @Column
  public caption!: string;

  @Column
  public url!: string;

  // we use the postgress @CreatAT to help us to keep the
  // data up to date
  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
