import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaBootstrap } from 'react-icons/fa';
import {
    SiTailwindcss,
    SiMui,
    SiNextdotjs,
    SiNestjs,
    SiPostgresql,
    SiMongodb,
    SiGraphql,
    SiExpress,
    SiLaravel,
    SiSwagger,
    SiPostman,
    SiTypescript,
    SiFirebase,
    SiMysql,
} from 'react-icons/si';

const skills = {
    frontend: [
        { name: 'HTML5', icon: FaHtml5, color: '#e34f26' },
        { name: 'CSS3', icon: FaCss3Alt, color: '#1572b6' },
        { name: 'JavaScript', icon: FaJs, color: '#f7df1e' },
        { name: 'React', icon: FaReact, color: '#61dafb' },
        { name: 'TailwindCSS', icon: SiTailwindcss, color: '#38b2ac' },
        { name: 'Material-UI', icon: SiMui, color: '#0081cb' },
        { name: 'Bootstrap', icon: FaBootstrap, color: '#7952b3' },
        { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
        { name: 'TypeScript', icon: SiTypescript, color: '#007acc' },
    ],
    backend: [
        { name: 'Node.JS', icon: FaNodeJs, color: '#339933' },
        { name: 'NestJS', icon: SiNestjs, color: '#e0234e' },
        { name: 'Express', icon: SiExpress, color: '#000000' },
        { name: 'Laravel', icon: SiLaravel, color: '#ff2d20' },
        { name: 'GraphQL', icon: SiGraphql, color: '#e10098' },
        { name: 'Swagger', icon: SiSwagger, color: '#85ea2d' },
        { name: 'Postman', icon: SiPostman, color: '#ff6c37' },
    ],
    database: [
        { name: 'MySQL', icon: SiMysql, color: '#4479a1' },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169e1' },
        { name: 'Firebase', icon: SiFirebase, color: '#ffca28' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47a248' },
    ],
};

export default skills;
