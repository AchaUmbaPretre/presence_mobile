import { StyleSheet, Dimensions, Platform } from 'react-native';
import { getFontFamily } from '@/constants/typography';
import { COLORS } from '@/screens/dashboard/constants/color';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },

  // Effets de fond
  shimmerOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'none',
  },

  // Particules
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  // Confettis
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 3,
  },

  // Contenu principal
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    zIndex: 10,
  },

  // Icône et cercle animé
  iconWrapper: {
    width: 140,
    height: 140,
    marginBottom: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },

  // Titres
  title: {
    fontSize: 38,
    fontFamily: getFontFamily('bold'),
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Carte message
  messageCard: {
    width: '100%',
    marginBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary.main}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[700],
    flex: 1,
    lineHeight: 22,
  },

  // Carte détails
  detailsWrapper: {
    width: '100%',
    marginBottom: 36,
  },
  detailsCard: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    elevation: 16,
  },
  detailsCardGradient: {
    borderRadius: 28,
    overflow: 'hidden',
  },

  // En-tête carte
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardHeaderBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[800],
  },
  expandButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Métriques principales
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontFamily: getFontFamily('bold'),
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
  },

  // Contenu expansible
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },

  // Grille d'informations
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  infoGridItem: {
    flex: 1,
    minWidth: (width - 88) / 2,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  infoGridLabel: {
    fontSize: 11,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[500],
    marginTop: 8,
    marginBottom: 4,
  },
  infoGridValue: {
    fontSize: 13,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[700],
    textAlign: 'center',
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 12,
  },
  statValue: {
    fontSize: 15,
    fontFamily: getFontFamily('bold'),
    color: COLORS.gray[700],
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[500],
  },

  // Boutons d'action
  actionsContainer: {
    width: '100%',
    gap: 14,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonSecondary: {
    marginTop: 0,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  actionButtonText: {
    fontSize: 17,
    fontFamily: getFontFamily('semibold'),
    letterSpacing: -0.2,
  },

  // États textuels
  entreeText: {
    color: COLORS.success.main,
  },
  sortieText: {
    color: COLORS.warning.main,
  },
  successText: {
    color: COLORS.success.main,
  },
  warningText: {
    color: COLORS.warning.main,
  },
});