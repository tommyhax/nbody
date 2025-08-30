function gaussGenerator () {
    // Box-Muller algorithm

    const buffer = [];

    return function () {
        if (buffer.length === 0) {
            let v = Math.random();
            let u = 0;
            do {
                u = Math.random()
            }
            while (u === 0);

            const r = Math.sqrt(-2 * Math.log(u));

            buffer.push(r * Math.cos(2 * Math.PI * v));
            buffer.push(r * Math.sin(2 * Math.PI * v));
        }

        return buffer.pop();
    }
}

const gauss = gaussGenerator();

const normal = (mu = 0, sigma = 1) => mu + sigma * gauss();

