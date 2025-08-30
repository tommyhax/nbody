const Particle = function (id, mass, position, velocity, acceleration) {
    this.id = id;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
}

Particle.prototype.update = function (dt, getAcceleration) {
    // Velocity Verlet Algorithm

    const dtHalf = dt / 2;

    const vHalf = this.velocity.add(this.acceleration.mul(dtHalf));

    this.position = this.position.add(vHalf.mul(dt));
    this.acceleration = getAcceleration(this.id);
    this.velocity = vHalf.add(this.acceleration.mul(dtHalf));
}
