const System = function (N, averageMass = 1, systemRadius = 10, e2 = 1e-2) {
    // Distance: astronomical units
    // Mass: solar masses
    // Time: earth years
    this.G = 4 * Math.PI ** 2

    this.N = N;
    this.averageMass = averageMass;
    this.systemRadius = systemRadius;
    this.e2 = e2;

    this.particles = Array.from({ length: N }, (_, i) =>
        new Particle(
            i,
            randomMass(this.averageMass),
            randomPosition(this.systemRadius),
            randomVelocity(this.G, this.N, this.averageMass, this.systemRadius),
            Vector.zeroVector()
        )
    );

    this.zeroTotalMomentum();
}

System.prototype.zeroTotalMomentum = function () {
    let totalMomentum = Vector.zeroVector();
    let totalMass = 0;

    for (const p of this.particles) {
        totalMomentum = totalMomentum.add(p.velocity.mul(p.mass));
        totalMass += p.mass;
    }

    const vCorrection = totalMomentum.div(totalMass);

    for (const p of this.particles) {
        p.velocity = p.velocity.sub(vCorrection);
    }
};

System.prototype.getEnergy = function () {
    let kinetic = 0;
    for (const p of this.particles) {
        const v2 = p.velocity.normSquared();
        kinetic += 0.5 * p.mass * v2;
    }

    let potential = 0;
    for (let i = 0; i < this.N; ++i) {
        const pi = this.particles[i];
        for (let j = i + 1; j < this.N; ++j) {
            const pj = this.particles[j];
            const r = pi.position.sub(pj.position).norm();
            potential -= this.G * pi.mass * pj.mass / (r + this.e2);
        }
    }

    return {
        kinetic: kinetic,
        potential: potential
    };
};

System.prototype.getAcceleration = function (i) {
    let acceleration = Vector.zeroVector();

    for (let j = 0; j < this.N; ++j) {
        if (j === i) {
            continue;
        }

        const r = this.particles[j].position.sub(this.particles[i].position);
        acceleration = acceleration.add(r.mul(this.G * this.particles[j].mass / Math.pow(r.normSquared() + this.e2, 1.5)));
    }

    return acceleration;
}

System.prototype.update = function (dt) {
    const particlesCopy = this.particles.slice();

    for (let i = 0; i < this.N; ++i) {
        particlesCopy[i].update(dt, (i) => this.getAcceleration(i));
    }

    this.particles = particlesCopy;
}

System.prototype.render = function (ctx, gridAU) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(-halfWidth, -halfHeight, width, height);

    const scale = height / (2 * this.systemRadius);

    const gridSize = scale * gridAU;
    ctx.strokeStyle = 'rgba(200, 240, 255, 0.3)';
    ctx.linewidth = 0.5;
    ctx.beginPath();
    // Vertical lines
    for (let x = -halfWidth; x <= halfWidth; x += gridSize) {
        ctx.moveTo(x, -halfHeight);
        ctx.lineTo(x, halfHeight);
    }
    // Horizontal lines
    for (let y = -halfHeight; y <= halfHeight; y += gridSize) {
        ctx.moveTo(-halfWidth, y);
        ctx.lineTo(halfWidth, y);
    }
    ctx.stroke();

    const radius = 3;
    for (const p of this.particles) {
        const x = p.position.components[0] * scale;
        const y = p.position.components[1] * scale;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function randomMass (averageMass = 1, star = true) {
    return normal(averageMass, 0.2);
}

function randomPosition (systemRadius) {
    return Vector.randomVolumeVector(systemRadius);
}

function randomVelocity (G, N, averageMass, systemRadius) {
    const escapeVelocity = Math.sqrt(G * N * averageMass / systemRadius);
    return Vector.randomVolumeVector(escapeVelocity / 2);
}
