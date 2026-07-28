import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getContent, updateContent } from '../../services/cmsService';
import { personalInfo, skills, experiences, education, services, stats, strengths, languages } from '../../data/portfolioData';

const defaultData = {
  personalInfo,
  skills,
  experiences,
  education,
  services,
  stats,
  strengths,
  languages
};

const ContentEditor = () => {
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sections = [
    { id: 'personalInfo', label: 'Personal Info', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '🎯' },
    { id: 'experiences', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'services', label: 'Services', icon: '⚡' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'strengths', label: 'Strengths', icon: '💪' },
    { id: 'languages', label: 'Languages', icon: '🌐' },
  ];

  useEffect(() => {
    loadContent();
  }, [activeSection]);

  const loadContent = async () => {
    try {
      setLoading(true);

      const response = await getContent(activeSection);

      let data = response?.data;

      // Fallback to default data if API returns nothing
      if (!data) {
        data = defaultData[activeSection];
      }

      // Normalize Skills
      if (activeSection === "skills") {
        Object.keys(data).forEach((key) => {
          if (!Array.isArray(data[key])) {
            if (typeof data[key] === "object" && data[key] !== null) {
              data[key] = Object.values(data[key]);
            } else {
              data[key] = [];
            }
          }
        });
      }

      // Normalize array-based sections
      const arraySections = ['experiences', 'education', 'services', 'stats', 'strengths', 'languages'];
      if (arraySections.includes(activeSection) && !Array.isArray(data)) {
        if (typeof data === "object" && data !== null) {
          data = Object.values(data);
        } else {
          data = [];
        }
      }

      // Normalize personalInfo
      if (activeSection === "personalInfo" && (typeof data !== "object" || data === null)) {
        data = defaultData.personalInfo;
      }

      setContent(data);
    } catch (err) {
      setContent(defaultData[activeSection]);
    } finally {
      setLoading(false);
      setHasChanges(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateContent(activeSection, content);
      toast.success(`${sections.find(s => s.id === activeSection).label} updated successfully!`);
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset to default data? All changes will be lost.')) {
      setContent(defaultData[activeSection]);
      setHasChanges(true);
      toast.info('Reset to defaults. Click Save to apply.');
    }
  };

  const renderEditor = () => {
    if (loading) return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );

    switch (activeSection) {
      case 'personalInfo':
        return renderPersonalInfoEditor();
      case 'skills':
        return renderSkillsEditor();
      case 'experiences':
        return renderExperiencesEditor();
      case 'education':
        return renderEducationEditor();
      case 'services':
        return renderServicesEditor();
      case 'stats':
        return renderStatsEditor();
      case 'strengths':
        return renderStrengthsEditor();
      case 'languages':
        return renderLanguagesEditor();
      default:
        return null;
    }
  };

  // ===== PERSONAL INFO EDITOR (FIXED) =====
  // ===== PERSONAL INFO EDITOR (UPDATED WITH IMAGE OPTION) =====
  const renderPersonalInfoEditor = () => {
    // Guard: ensure content is a valid object
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return (
        <div className="text-red-400">
          Invalid Personal Info Data
        </div>
      );
    }

    const fields = [
      { key: 'name', label: 'Full Name', type: 'text' },
      { key: 'title', label: 'Job Title', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'email', label: 'Email', type: 'email' },
    ];

    // Handle local image file uploads by converting to Base64
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newContent = { ...content, avatar: reader.result };
          setContent(newContent);
          setHasChanges(true);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-4">
        {/* Avatar Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start md:items-center">
          <label className="text-sm font-medium text-slate-400 md:text-right">Avatar Image</label>
          <div className="md:col-span-3 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Image Preview */}
            <div className="flex-shrink-0">
              {content.avatar && content.avatar.length > 5 ? (
                <img
                  src={content.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-slate-700 bg-slate-800"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Img
                </div>
              )}
            </div>
            
            {/* Upload & URL Inputs */}
            <div className="flex-1 space-y-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer transition-all"
              />
              <input
                type="text"
                placeholder="Or enter image URL / Initials..."
                value={content.avatar || ''}
                onChange={(e) => {
                  const newContent = { ...content, avatar: e.target.value };
                  setContent(newContent);
                  setHasChanges(true);
                }}
                className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Standard Fields */}
        {fields.map(field => (
          <div key={field.key} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="text-sm font-medium text-slate-400 md:text-right">{field.label}</label>
            <input
              type={field.type}
              value={content[field.key] || ''}
              onChange={(e) => {
                const newContent = { ...content, [field.key]: e.target.value };
                setContent(newContent);
                setHasChanges(true);
              }}
              className="md:col-span-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
          </div>
        ))}

        {/* Summary Textarea */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <label className="text-sm font-medium text-slate-400 md:text-right pt-2">Summary</label>
          <textarea
            value={content.summary || ''}
            onChange={(e) => {
              const newContent = { ...content, summary: e.target.value };
              setContent(newContent);
              setHasChanges(true);
            }}
            rows={4}
            className="md:col-span-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
          />
        </div>
      </div>
    );
  };

  // ===== SKILLS EDITOR (REFERENCE - ALREADY FIXED) =====
  const renderSkillsEditor = () => {
    if (!content || typeof content !== "object") {
      return (
        <div className="text-red-400">
          Invalid Skills Data
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(content).map(([category, skillsList]) => {
          let skills = [];

          if (Array.isArray(skillsList)) {
            skills = skillsList;
          } else if (
            skillsList &&
            typeof skillsList === "object"
          ) {
            skills = Object.values(skillsList);
          }

          return (
            <div
              key={category}
              className="glass-card p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-white capitalize">
                  {category.replace(/([A-Z])/g, " $1")}
                </h4>

                <button
                  onClick={() => {
                    const newContent = {
                      ...content,
                      [category]: [
                        ...skills,
                        {
                          name: "",
                          level: 50,
                        },
                      ],
                    };

                    setContent(newContent);
                    setHasChanges(true);
                  }}
                  className="text-blue-400 text-sm"
                >
                  + Add Skill
                </button>
              </div>

              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-center"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={skill?.name || ""}
                        placeholder="Skill Name"
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[index] = {
                            ...updated[index],
                            name: e.target.value,
                          };
                          setContent({
                            ...content,
                            [category]: updated,
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="col-span-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill?.level || 0}
                        onChange={(e) => {
                          const updated = [...skills];
                          updated[index] = {
                            ...updated[index],
                            level: Number(e.target.value),
                          };
                          setContent({
                            ...content,
                            [category]: updated,
                          });
                          setHasChanges(true);
                        }}
                        className="w-full"
                      />
                    </div>

                    <div className="col-span-2 text-blue-400">
                      {skill?.level || 0}%
                    </div>

                    <div className="col-span-1">
                      <button
                        className="text-red-400"
                        onClick={() => {
                          const updated = skills.filter(
                            (_, i) => i !== index
                          );
                          setContent({
                            ...content,
                            [category]: updated,
                          });
                          setHasChanges(true);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ===== EXPERIENCES EDITOR (FIXED) =====
  const renderExperiencesEditor = () => {
    // Guard: normalize to array
    let experiences = [];
    if (Array.isArray(content)) {
      experiences = content;
    } else if (content && typeof content === "object") {
      experiences = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {experiences.map((exp, index) => {
          // Guard each experience item
          const safeExp = exp && typeof exp === "object" ? exp : {};

          return (
            <div key={safeExp.id || index} className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">Experience #{index + 1}</h4>
                <button
                  onClick={() => {
                    const newExp = experiences.filter((_, i) => i !== index);
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Job Title"
                  value={safeExp.title || ""}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index] = { ...safeExp, title: e.target.value };
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Company"
                  value={safeExp.company || ""}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index] = { ...safeExp, company: e.target.value };
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Location"
                  value={safeExp.location || ""}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index] = { ...safeExp, location: e.target.value };
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Period"
                  value={safeExp.period || ""}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index] = { ...safeExp, period: e.target.value };
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Description Points (one per line)</p>
                <textarea
                  value={Array.isArray(safeExp.description) ? safeExp.description.join('\n') : ''}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[index] = {
                      ...safeExp,
                      description: e.target.value.split('\n').filter(Boolean),
                    };
                    setContent(newExp);
                    setHasChanges(true);
                  }}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none resize-none"
                  placeholder="Enter description points, one per line"
                />
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newExp = [...experiences];
            newExp.push({
              id: Date.now(),
              title: '',
              company: '',
              location: '',
              period: '',
              type: 'past',
              description: [],
              icon: 'Briefcase',
            });
            setContent(newExp);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Experience
        </button>
      </div>
    );
  };

  // ===== EDUCATION EDITOR (FIXED) =====
  const renderEducationEditor = () => {
    // Guard: normalize to array
    let education = [];
    if (Array.isArray(content)) {
      education = content;
    } else if (content && typeof content === "object") {
      education = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {education.map((edu, index) => {
          // Guard each education item
          const safeEdu = edu && typeof edu === "object" ? edu : {};

          return (
            <div key={safeEdu.id || index} className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">Education #{index + 1}</h4>
                <button
                  onClick={() => {
                    const newEdu = education.filter((_, i) => i !== index);
                    setContent(newEdu);
                    setHasChanges(true);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Degree/Course"
                  value={safeEdu.degree || ""}
                  onChange={(e) => {
                    const newEdu = [...education];
                    newEdu[index] = { ...safeEdu, degree: e.target.value };
                    setContent(newEdu);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <input
                  placeholder="Institution"
                  value={safeEdu.institution || ""}
                  onChange={(e) => {
                    const newEdu = [...education];
                    newEdu[index] = { ...safeEdu, institution: e.target.value };
                    setContent(newEdu);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <select
                  value={safeEdu.status || "Completed"}
                  onChange={(e) => {
                    const newEdu = [...education];
                    newEdu[index] = { ...safeEdu, status: e.target.value };
                    setContent(newEdu);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <select
                  value={safeEdu.color || "blue"}
                  onChange={(e) => {
                    const newEdu = [...education];
                    newEdu[index] = { ...safeEdu, color: e.target.value };
                    setContent(newEdu);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="amber">Amber</option>
                  <option value="emerald">Emerald</option>
                </select>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newEdu = [...education];
            newEdu.push({
              id: Date.now(),
              degree: '',
              institution: '',
              status: 'Completed',
              icon: 'GraduationCap',
              color: 'blue',
            });
            setContent(newEdu);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Education
        </button>
      </div>
    );
  };

  // ===== SERVICES EDITOR (FIXED) =====
  const renderServicesEditor = () => {
    // Guard: normalize to array
    let services = [];
    if (Array.isArray(content)) {
      services = content;
    } else if (content && typeof content === "object") {
      services = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {services.map((service, index) => {
          // Guard each service item
          const safeService = service && typeof service === "object" ? service : {};

          return (
            <div key={safeService.id || index} className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white">Service #{index + 1}</h4>
                <button
                  onClick={() => {
                    const newServices = services.filter((_, i) => i !== index);
                    setContent(newServices);
                    setHasChanges(true);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  placeholder="Service Title"
                  value={safeService.title || ""}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index] = { ...safeService, title: e.target.value };
                    setContent(newServices);
                    setHasChanges(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={safeService.description || ""}
                  onChange={(e) => {
                    const newServices = [...services];
                    newServices[index] = { ...safeService, description: e.target.value };
                    setContent(newServices);
                    setHasChanges(true);
                  }}
                  rows={2}
                  className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none resize-none"
                />
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Features (comma separated)</p>
                  <input
                    placeholder="Feature 1, Feature 2, Feature 3"
                    value={Array.isArray(safeService.features) ? safeService.features.join(', ') : ''}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index] = {
                        ...safeService,
                        features: e.target.value.split(',').map(f => f.trim()).filter(Boolean),
                      };
                      setContent(newServices);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newServices = [...services];
            newServices.push({
              id: Date.now(),
              title: '',
              description: '',
              icon: 'Globe',
              features: [],
            });
            setContent(newServices);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Service
        </button>
      </div>
    );
  };

  // ===== STATS EDITOR (FIXED) =====
  const renderStatsEditor = () => {
    // Guard: normalize to array
    let stats = [];
    if (Array.isArray(content)) {
      stats = content;
    } else if (content && typeof content === "object") {
      stats = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {stats.map((stat, index) => {
          // Guard each stat item
          const safeStat = stat && typeof stat === "object" ? stat : {};

          return (
            <div key={index} className="glass-card p-4">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    placeholder="Label"
                    value={safeStat.label || ""}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[index] = { ...safeStat, label: e.target.value };
                      setContent(newStats);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    placeholder="Value"
                    value={safeStat.value || 0}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[index] = { ...safeStat, value: parseInt(e.target.value) || 0 };
                      setContent(newStats);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    placeholder="Suffix"
                    value={safeStat.suffix || ""}
                    onChange={(e) => {
                      const newStats = [...stats];
                      newStats[index] = { ...safeStat, suffix: e.target.value };
                      setContent(newStats);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => {
                      const newStats = stats.filter((_, i) => i !== index);
                      setContent(newStats);
                      setHasChanges(true);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newStats = [...stats];
            newStats.push({ label: '', value: 0, suffix: '+' });
            setContent(newStats);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Stat
        </button>
      </div>
    );
  };

  // ===== STRENGTHS EDITOR (FIXED) =====
  const renderStrengthsEditor = () => {
    // Guard: normalize to array
    let strengths = [];
    if (Array.isArray(content)) {
      strengths = content;
    } else if (content && typeof content === "object") {
      strengths = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {strengths.map((strength, index) => {
          // Guard each strength item
          const safeStrength = strength && typeof strength === "object" ? strength : {};

          return (
            <div key={index} className="glass-card p-4">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    placeholder="Strength Name"
                    value={safeStrength.name || ""}
                    onChange={(e) => {
                      const newStrengths = [...strengths];
                      newStrengths[index] = { ...safeStrength, name: e.target.value };
                      setContent(newStrengths);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-5">
                  <input
                    placeholder="Icon Name"
                    value={safeStrength.icon || ""}
                    onChange={(e) => {
                      const newStrengths = [...strengths];
                      newStrengths[index] = { ...safeStrength, icon: e.target.value };
                      setContent(newStrengths);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => {
                      const newStrengths = strengths.filter((_, i) => i !== index);
                      setContent(newStrengths);
                      setHasChanges(true);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newStrengths = [...strengths];
            newStrengths.push({ name: '', icon: 'Star' });
            setContent(newStrengths);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Strength
        </button>
      </div>
    );
  };

  // ===== LANGUAGES EDITOR (FIXED) =====
  const renderLanguagesEditor = () => {
    // Guard: normalize to array
    let languages = [];
    if (Array.isArray(content)) {
      languages = content;
    } else if (content && typeof content === "object") {
      languages = Object.values(content);
    }

    return (
      <div className="space-y-4">
        {languages.map((lang, index) => {
          // Guard each language item
          const safeLang = lang && typeof lang === "object" ? lang : {};

          return (
            <div key={index} className="glass-card p-4">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4">
                  <input
                    placeholder="Language"
                    value={safeLang.name || ""}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[index] = { ...safeLang, name: e.target.value };
                      setContent(newLangs);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    placeholder="Proficiency"
                    value={safeLang.proficiency || ""}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[index] = { ...safeLang, proficiency: e.target.value };
                      setContent(newLangs);
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={safeLang.level || 0}
                    onChange={(e) => {
                      const newLangs = [...languages];
                      newLangs[index] = { ...safeLang, level: parseInt(e.target.value) };
                      setContent(newLangs);
                      setHasChanges(true);
                    }}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2 text-right text-sm text-blue-400 font-medium">
                  {safeLang.level || 0}%
                </div>
              </div>
            </div>
          );
        })}
        <button
          onClick={() => {
            const newLangs = [...languages];
            newLangs.push({ name: '', proficiency: 'Basic', level: 50 });
            setContent(newLangs);
            setHasChanges(true);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 transition-all"
        >
          + Add New Language
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Editor</h2>
          <p className="text-slate-400 text-sm">Manage your portfolio content</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 text-sm">
              <AlertTriangle size={16} />
              Unsaved changes
            </div>
          )}
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm">
            <RotateCcw size={16} />
            Reset
          </button>
          <button onClick={handleSave} disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button key={section.id} onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}>
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Editing: {sections.find(s => s.id === activeSection)?.label}</h3>
          {content && (
            <span className="text-xs text-slate-500">
              {Array.isArray(content) ? `${content.length} items` : 'Object data'}
            </span>
          )}
        </div>
        {renderEditor()}
      </div>
    </div>
  );
};

export default ContentEditor;