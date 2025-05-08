import React, { useState, useEffect } from "react";
import "./GithubSearch.css";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaGithub, 
  FaTwitter, 
  FaLink, 
  FaUser, 
  FaCode, 
  FaUsers,
  FaStar,
  FaCodeBranch,
  FaCalendarAlt
} from 'react-icons/fa';
import { PiBuildingsFill } from 'react-icons/pi';
import { RiGitRepositoryFill } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

function GithubSearch() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      const [profileRes, reposRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`)
      ]);
      
      setProfile(profileRes.data);
      setRepos(reposRes.data);
      setError(null);
    } catch (error) {
      setProfile(null);
      setRepos([]);
      setError("User not found. Please try another username.");
    } finally {
      setIsLoading(false);
    }
  }

  const resetSearch = () => {
    setUsername("");
    setProfile(null);
    setError(null);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="main-container">
      <div className="background-blur"></div>
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            animationDelay: `${Math.random() * 5}s`
          }}></div>
        ))}
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="header"
      >
        <h1 className="main-heading">
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="github-icon-container"
          >
            <FaGithub className="github-icon" />
          </motion.span>
          GitHub <span className="highlight">Profile</span> Detective
        </h1>
        <p className="subheading">Uncover developer profiles with precision</p>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className={`search-form ${isFocused ? 'focused' : ''}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <div className="search-input-container">
          <FiSearch className="search-icon" />
          <input 
            type="text"
            placeholder="Search GitHub username..."
            value={username}
            className="search-input"
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {username && (
            <button 
              type="button" 
              className="clear-btn"
              onClick={resetSearch}
            >
              <IoClose />
            </button>
          )}
        </div>
        <motion.button 
          type="submit" 
          className="search-btn"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <span className="spinner"></span>
          ) : (
            <span>Search</span>
          )}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-msg"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring" }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profile && (
          <motion.div 
            className='profile-container'
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <motion.div 
              className='profile-card'
              variants={cardVariants}
            >
              <div className='profile-header'>
                <motion.div 
                  className='avatar-container'
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="avatar-glow"></div>
                  <img 
                    src={profile.avatar_url} 
                    alt='Avatar' 
                    className='profile-avatar'
                  />
                  <div className="avatar-halo"></div>
                </motion.div>

                <div className='profile-titles'>
                  <motion.h2 className='profile-name' variants={itemVariants}>
                    {profile.name || profile.login}
                  </motion.h2>
                  <motion.a 
                    href={profile.html_url} 
                    target='_blank' 
                    rel="noreferrer" 
                    className='profile-username'
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    @{profile.login}
                  </motion.a>
                  <motion.p className='profile-bio' variants={itemVariants}>
                    {profile.bio || "This profile has no bio"}
                  </motion.p>
                </div>
              </div>

              <motion.div className='profile-stats' variants={itemVariants}>
                <div className='stat-item'>
                  <div className="stat-icon-container">
                    <RiGitRepositoryFill className="stat-icon" />
                  </div>
                  <div>
                    <span className='stat-number'>{profile.public_repos}</span>
                    <span className='stat-label'>Repositories</span>
                  </div>
                </div>
                <div className='stat-item'>
                  <div className="stat-icon-container">
                    <FaUsers className="stat-icon" />
                  </div>
                  <div>
                    <span className='stat-number'>{profile.followers}</span>
                    <span className='stat-label'>Followers</span>
                  </div>
                </div>
                <div className='stat-item'>
                  <div className="stat-icon-container">
                    <FaUser className="stat-icon" />
                  </div>
                  <div>
                    <span className='stat-number'>{profile.following}</span>
                    <span className='stat-label'>Following</span>
                  </div>
                </div>
              </motion.div>

              <motion.div className='profile-info' variants={itemVariants}>
                {profile.location && (
                  <div className='info-item'>
                    <div className="info-icon-container">
                      <FaMapMarkerAlt className="info-icon" />
                    </div>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.company && (
                  <div className='info-item'>
                    <div className="info-icon-container">
                      <PiBuildingsFill className="info-icon" />
                    </div>
                    <span>{profile.company}</span>
                  </div>
                )}
                {profile.twitter_username && (
                  <a 
                    href={`https://twitter.com/${profile.twitter_username}`} 
                    target='_blank' 
                    rel="noreferrer" 
                    className='info-item link'
                  >
                    <div className="info-icon-container">
                      <FaTwitter className="info-icon" />
                    </div>
                    <span>@{profile.twitter_username}</span>
                  </a>
                )}
                {profile.blog && (
                  <a 
                    href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} 
                    target='_blank' 
                    rel="noreferrer" 
                    className='info-item link'
                  >
                    <div className="info-icon-container">
                      <FaLink className="info-icon" />
                    </div>
                    <span>{profile.blog.replace(/(^\w+:|^)\/\//, '')}</span>
                  </a>
                )}
                <div className='info-item'>
                  <div className="info-icon-container">
                    <FaCalendarAlt className="info-icon" />
                  </div>
                  <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </motion.div>

              {repos.length > 0 && (
                <motion.div className='recent-repos' variants={itemVariants}>
                  <h3 className='repos-title'>Recent Activity</h3>
                  <div className='repo-list'>
                    {repos.map((repo, index) => (
                      <motion.a 
                        key={repo.id} 
                        href={repo.html_url} 
                        target='_blank' 
                        rel="noreferrer" 
                        className='repo-item'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className='repo-header'>
                          <div className='repo-name'>{repo.name}</div>
                          <div className='repo-stats'>
                            <span className='repo-stat'>
                              <FaStar /> {repo.stargazers_count}
                            </span>
                            <span className='repo-stat'>
                              <FaCodeBranch /> {repo.forks_count}
                            </span>
                          </div>
                        </div>
                        {repo.description && (
                          <p className='repo-desc'>{repo.description}</p>
                        )}
                        <div className='repo-language'>
                          {repo.language && (
                            <>
                              <span 
                                className='language-color'
                                style={{ 
                                  backgroundColor: 
                                    repo.language === 'JavaScript' ? '#f1e05a' :
                                    repo.language === 'TypeScript' ? '#3178c6' :
                                    repo.language === 'HTML' ? '#e34c26' :
                                    repo.language === 'CSS' ? '#563d7c' :
                                    repo.language === 'Python' ? '#3572A5' :
                                    '#ccc'
                                }}
                              ></span>
                              {repo.language}
                            </>
                          )}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div 
                className='profile-footer'
                variants={itemVariants}
              >
                <motion.a 
                  href={profile.html_url} 
                  target='_blank' 
                  rel="noreferrer" 
                  className='view-profile-btn'
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 5px 15px rgba(3, 102, 214, 0.3)'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub /> View Full Profile
                </motion.a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GithubSearch;