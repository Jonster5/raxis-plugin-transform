import { ECS, ECSPlugin, Vec2 } from 'raxis-core';
import { Time, TimeData } from 'raxis-plugin-time';

export class Transform {
    constructor(
        public size: Vec2 = new Vec2(0, 0),
        public pos: Vec2 = new Vec2(0, 0),
        public angle: number = 0,
        public vel: Vec2 = new Vec2(0, 0),
        public avel: number = 0,
        public last: {
            pos: Vec2;
            angle: number;
        } = {
            pos: new Vec2(0, 0),
            angle: 0,
        },
    ) {}
}

function checkTransformCompatibility(ecs: ECS) {
    const hasTime = !!ecs.getResource(Time);
    const hasTimeData = !!ecs.getResource(TimeData);

    if (!hasTime || !hasTimeData) {
        throw new Error(
            `raxis-plugin-transform requires plugin [raxis-plugin-time]`,
        );
    }
}

function updateTransform(ecs: ECS) {
    const time: Time = ecs.getResource(Time);
    const { speed }: TimeData = ecs.getResource(TimeData);
    const transforms: Transform[] = ecs.queryComponents(Transform);

    transforms.forEach((t) => {
        t.last.pos.setFrom(t.pos);
        t.last.angle = t.angle;

        t.pos.add(t.vel.clone().mul((time.delta * speed) / 1000));
        t.angle += ((time.delta * speed) / 1000) * t.avel;
    });
}

export const TransformPlugin: ECSPlugin = {
    components: [Transform],
    startup: [checkTransformCompatibility],
    systems: [updateTransform],
};
