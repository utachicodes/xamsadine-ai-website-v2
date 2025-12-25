
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				islamic: {
					// Rich, sophisticated emerald greens
					green: {
						DEFAULT: '#047857', // emerald-700
						light: '#10b981', // emerald-500
						dark: '#064e3b', // emerald-900
						50: '#ecfdf5',
						100: '#d1fae5',
						200: '#a7f3d0',
						300: '#6ee7b7',
						400: '#34d399',
						500: '#10b981',
						600: '#059669',
						700: '#047857',
						800: '#065f46',
						900: '#064e3b',
					},
					// Vibrant teal accents
					teal: {
						DEFAULT: '#0d9488', // teal-600
						light: '#14b8a6', // teal-500
						dark: '#115e59', // teal-800
						50: '#f0fdfa',
						100: '#ccfbf1',
						200: '#99f6e4',
						300: '#5eead4',
						400: '#2dd4bf',
						500: '#14b8a6',
						600: '#0d9488',
						700: '#0f766e',
						800: '#115e59',
						900: '#134e4a',
					},
					// Deep, elegant blue
					blue: {
						DEFAULT: '#1e40af', // blue-800
						light: '#3b82f6', // blue-500
						dark: '#1e3a8a', // blue-900
						50: '#eff6ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a',
					},
					// Luxurious gold
					gold: {
						DEFAULT: '#c8a24a',
						light: '#e0c36a',
						dark: '#8c6a1f',
						50: '#fbf7e6',
						100: '#f5edc8',
						200: '#eadc92',
						300: '#dec55f',
						400: '#d4b24b',
						500: '#c8a24a',
						600: '#b58b3c',
						700: '#9a6f2f',
						800: '#7a5425',
						900: '#5f3f1c',
					},
					// Soft neutral cream
					cream: {
						DEFAULT: '#fef3c7',
						light: '#fffbeb',
						dark: '#fde68a',
					},
					// Deep, rich dark
					dark: {
						DEFAULT: '#0f172a', // slate-900
						light: '#1e293b', // slate-800
						lighter: '#334155', // slate-700
					},
					// Clean, bright light
					light: {
						DEFAULT: '#f8fafc', // slate-50
						dark: '#f1f5f9', // slate-100
					}
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0) translateX(0)'
					},
					'50%': {
						transform: 'translateY(-15px) translateX(10px)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.5',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'rotate-slow': {
					from: {
						transform: 'rotate(0deg)'
					},
					to: {
						transform: 'rotate(360deg)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-500px 0'
					},
					'100%': {
						backgroundPosition: '500px 0'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'pattern-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'shimmer': 'shimmer 3s infinite linear',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'pattern-rotate': 'pattern-rotate 40s linear infinite',
				'blob': 'blob 7s infinite',
				'wave': 'wave 2s ease-in-out infinite'
			},
			backgroundImage: {
				'islamic-pattern': "url('/pattern.svg')",
				'hero-gradient': 'linear-gradient(135deg, #047857 0%, #0d9488 50%, #1e40af 100%)',
				'hero-gradient-alt': 'linear-gradient(to bottom right, rgba(4, 120, 87, 0.95), rgba(13, 148, 136, 0.9), rgba(30, 64, 175, 0.95))',
				'card-gradient': 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
				'gold-gradient': 'linear-gradient(90deg, #c8a24a 0%, #e0c36a 50%, #c8a24a 100%)',
				'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(4, 120, 87, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(13, 148, 136, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(30, 64, 175, 0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(200, 162, 74, 0.22) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(4, 120, 87, 0.2) 0px, transparent 50%)',
				'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
