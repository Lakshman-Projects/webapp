export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("files", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            fileName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            size: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            mimeType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("files");
    },
};
