import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({
    type: 'datetime',
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP(2)',
    precision: 2,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        if (value) {
          const istTimestamp = new Date(value.getTime() + 5.5 * 60 * 60 * 1000);
          return istTimestamp;
        }
        return value;
      },
    },
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP(2)',
    precision: 2,
    onUpdate: 'CURRENT_TIMESTAMP(2)',
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        if (value) {
          const istDate = new Date(value.getTime() + 5.5 * 60 * 60 * 1000);
          return istDate;
        }
        return value;
      },
    },
  })
  updatedAt: Date;
}
