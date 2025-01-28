export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("health_checks", {
            checkId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            datetime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("health_checks");
    },
};
