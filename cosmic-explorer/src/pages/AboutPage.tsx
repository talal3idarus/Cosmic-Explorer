import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaGraduationCap, 
  FaCode, 
  FaRocket, 
  FaHeart, 
  FaGithub, 
  FaLinkedin, 
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaLaptopCode,
  FaGlobe,
  FaStar
} from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const skills = [
    { name: 'React & TypeScript', level: 90, color: 'text-blue-400' },
    { name: 'Node.js & Express', level: 85, color: 'text-green-400' },
    { name: 'Python & Django', level: 80, color: 'text-yellow-400' },
    { name: 'Database Design', level: 75, color: 'text-purple-400' },
    { name: 'UI/UX Design', level: 70, color: 'text-pink-400' },
    { name: 'Cloud Computing', level: 65, color: 'text-orange-400' }
  ];

  const projects = [
    {
      title: 'Cosmic Explorer',
      description: 'Interactive NASA data visualization platform with real-time space data and collapsible sidebar',
      tech: ['React', 'TypeScript', 'NASA APIs', 'TailwindCSS', 'Framer Motion'],
      status: 'Active'
    },
    {
      title: 'Pathfinder',
      description: 'Web-based career guidance system for students aged 15-16, helping them choose the right career path',
      tech: ['Web Development', 'Career Guidance', 'Student Assessment'],
      status: 'In Development'
    },
    {
      title: 'Home Grocery App',
      description: 'Mobile app created to solve a home problem within one weekend using Flutter',
      tech: ['Dart', 'Flutter', 'Mobile Development'],
      status: 'Completed'
    },
    {
      title: 'Python Projects',
      description: 'Collection of Python projects including games and utilities for learning and experimentation',
      tech: ['Python', 'Games', 'Utilities', 'Learning'],
      status: 'Ongoing'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <FaUser className="text-6xl text-white" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FaStar className="text-white text-sm" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Talal Ahmed Al Aidarus
          </h1>
          
          <div className="flex items-center justify-center space-x-2 text-xl text-gray-300 mb-2">
            <FaGraduationCap className="text-blue-400" />
            <span>Final-year Software Engineering Student</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-lg text-gray-400 mb-6">
            <FaMapMarkerAlt className="text-green-400" />
            <span>University of Technology and Applied Sciences (UTAS), Muscat, Oman</span>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Passionate about building innovative software solutions that connect technology with real-world impact. 
            I believe in the power of code to solve complex problems and create meaningful experiences that make a difference.
          </motion.p>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <FaRocket className="text-blue-400 mr-3" />
            About Me
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-400 mb-4">My Journey</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                As a final-year Software Engineering student at UTAS, I've dedicated myself to mastering 
                the art of creating digital solutions that bridge the gap between complex technology and 
                user-friendly experiences. I have a strong foundation in web development, database management, 
                and competitive programming.
              </p>
              <p className="text-gray-300 leading-relaxed">
                My passion lies in exploring the intersection of space technology, artificial intelligence, 
                and web development. This Cosmic Explorer project represents my love for both space exploration 
                and creating beautiful, functional applications. I once participated in a programming competition 
                with over 49 teams and secured a top 3 spot!
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Mission</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                I'm committed to developing software that not only solves problems but also inspires and educates. 
                Every line of code I write is driven by the desire to make technology more accessible and engaging.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through projects like Cosmic Explorer, I aim to democratize access to space data and make 
                the wonders of the universe more approachable for everyone.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <FaLaptopCode className="text-green-400 mr-3" />
            Technical Skills
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${skill.color}`}>{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: 0.5 + 0.1 * index, duration: 0.8 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <FaCode className="text-orange-400 mr-3" />
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : project.status === 'In Development'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <FaEnvelope className="text-pink-400 mr-3" />
            Get In Touch
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.a
              href="https://github.com/talal3idarus"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <FaGithub className="text-2xl text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <div className="text-white font-semibold">GitHub</div>
                <div className="text-gray-400 text-sm">@talal3idarus</div>
              </div>
            </motion.a>
            
            <motion.a
              href="https://www.linkedin.com/in/talalalaidarus"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <FaLinkedin className="text-2xl text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <div className="text-white font-semibold">LinkedIn</div>
                <div className="text-gray-400 text-sm">Talal Al Aidarus</div>
              </div>
            </motion.a>
            
            <motion.a
              href="mailto:talalaidarus@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <FaEnvelope className="text-2xl text-gray-400 group-hover:text-white transition-colors" />
              <div>
                <div className="text-white font-semibold">Email</div>
                <div className="text-gray-400 text-sm">talalaidarus@gmail.com</div>
              </div>
            </motion.a>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;
