import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIsActiveToUser1710968574632 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "isActive",
                type: "boolean",
                default: true,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "isActive");
    }
} 