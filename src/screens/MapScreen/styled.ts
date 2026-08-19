import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  clusterBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterBadgeText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  modal: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.ink,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalRowBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  modalRowBadgeFound: {
    backgroundColor: colors.found,
  },
  modalRowBadgeLost: {
    backgroundColor: colors.lost,
  },
  modalRowBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalRowCategory: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  modalClose: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: colors.stamp,
    fontWeight: '600',
  },
});
