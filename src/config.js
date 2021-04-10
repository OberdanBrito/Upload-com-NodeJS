class Config {

    get Upload() {
        return {
            store: '/upload/'
        }
    }

    get Service() {
        return {
            port: 16999
        }
    }

}

module.exports = Config