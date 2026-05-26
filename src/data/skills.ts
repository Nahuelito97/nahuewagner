import {
	FaHtml5,
	FaCss3Alt,
	FaJs,
	FaReact,
	FaNodeJs,
	FaPhp,
	FaDocker,
	FaGitAlt,
	FaAws,
} from 'react-icons/fa';
import {
	SiTailwindcss,
	SiMui,
	SiNestjs,
	SiPostgresql,
	SiMongodb,
	SiGraphql,
	SiExpress,
	SiLaravel,
	SiTypescript,
	SiFirebase,
	SiMysql,
	SiVuedotjs,
	SiDigitalocean,
	SiPostman,
	SiSwagger,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

export interface Skill {
	name: string;
	icon: IconType;
	color: string;
	/** Highlight as a core / primary stack tech. */
	primary?: boolean;
}

export interface SkillCategory {
	description: string;
	techs: Skill[];
}

const skills: Record<string, SkillCategory> = {
	backend: {
		description: 'APIs, services and integrations',
		techs: [
			{ name: 'NestJS', icon: SiNestjs, color: '#e0234e', primary: true },
			{ name: 'Node.js', icon: FaNodeJs, color: '#339933', primary: true },
			{ name: 'Laravel', icon: SiLaravel, color: '#ff2d20', primary: true },
			{ name: 'PHP', icon: FaPhp, color: '#777bb4' },
			{ name: 'Express', icon: SiExpress, color: '#f5f3fb' },
			{ name: 'GraphQL', icon: SiGraphql, color: '#e10098' },
		],
	},
	frontend: {
		description: 'Web UIs and dashboards',
		techs: [
			{ name: 'React', icon: FaReact, color: '#61dafb', primary: true },
			{ name: 'TypeScript', icon: SiTypescript, color: '#007acc', primary: true },
			{ name: 'TailwindCSS', icon: SiTailwindcss, color: '#38b2ac', primary: true },
			{ name: 'JavaScript', icon: FaJs, color: '#f7df1e' },
			{ name: 'Vue.js', icon: SiVuedotjs, color: '#42b883' },
			{ name: 'Material UI', icon: SiMui, color: '#0081cb' },
			{ name: 'HTML5', icon: FaHtml5, color: '#e34f26' },
			{ name: 'CSS3', icon: FaCss3Alt, color: '#1572b6' },
		],
	},
	database: {
		description: 'Data modeling and persistence',
		techs: [
			{ name: 'PostgreSQL', icon: SiPostgresql, color: '#4169e1', primary: true },
			{ name: 'Firebase', icon: SiFirebase, color: '#ffca28', primary: true },
			{ name: 'MongoDB', icon: SiMongodb, color: '#47a248', primary: true },
			{ name: 'MySQL', icon: SiMysql, color: '#4479a1' },
		],
	},
	devops: {
		description: 'Build, ship and deploy',
		techs: [
			{ name: 'Docker', icon: FaDocker, color: '#2496ed', primary: true },
			{ name: 'AWS', icon: FaAws, color: '#ff9900', primary: true },
			{ name: 'Git', icon: FaGitAlt, color: '#f05032', primary: true },
			{ name: 'Digital Ocean', icon: SiDigitalocean, color: '#0080ff' },
			{ name: 'Postman', icon: SiPostman, color: '#ff6c37' },
			{ name: 'Swagger', icon: SiSwagger, color: '#85ea2d' },
		],
	},
};

export default skills;
