const Particle = function (id, mass, position, velocity, acceleration) {
    this.id = id;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.acceleration = acceleration;
}

Particle.prototype.update = function (dt, getAcceleration) {
    // Velocity Verlet Algorithm

    x1 = this.position.add(this.velocity.mul(dt)).add(this.acceleration.mul(dt * dt * 0.5));
    a1 = getAcceleration(this.id);
    v1 = this.velocity.add(this.acceleration.add(a1).mul(dt * 0.5));

    this.position = x1;
    this.acceleration = a1;
    this.velocity = v1;
}
