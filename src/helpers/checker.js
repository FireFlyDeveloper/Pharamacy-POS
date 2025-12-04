const jwt = process.env.JWT_SECRET;
const postgre = process.env.POSTGRESQL

function checker() {
    if (!jwt || !postgre) {
        console.error("Error: Environment variable is not set.");
        process.exit(1);
    }
}

module.exports = { checker };