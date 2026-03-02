import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChefOnboarding } from '../../hooks/use-chef-onboarding';
import { ChefTier } from '../../config/constants';
import { ChefOnboardingParamList } from '../../navigation/ChefOnboardingNavigator';

type NavigationProp = NativeStackNavigationProp<ChefOnboardingParamList, 'OnboardingHub'>;

interface Props {
  navigation: NavigationProp;
}

interface StepCardProps {
  title: string;
  description: string;
  isComplete: boolean;
  onPress: () => void;
}

function StepCard({ title, description, isComplete, onPress }: StepCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <View style={[styles.statusBadge, isComplete && styles.statusComplete]}>
          <Text style={[styles.statusText, isComplete && styles.statusTextComplete]}>
            {isComplete ? '\u2713' : '\u203A'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OnboardingHubScreen({ navigation }: Props) {
  const {
    chefProfile,
    stepCompletion,
    canGoLive,
    isLoading,
    error,
    goLive,
  } = useChefOnboarding();
  const [isGoingLive, setIsGoingLive] = useState(false);

  const handleGoLive = async () => {
    Alert.alert(
      'Go Live',
      'Your profile will be visible to consumers. Ready?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go Live',
          onPress: async () => {
            setIsGoingLive(true);
            try {
              await goLive();
              Alert.alert('You\'re Live!', 'Consumers can now discover your profile.');
            } catch {
              Alert.alert('Error', 'Failed to go live. Please try again.');
            } finally {
              setIsGoingLive(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const tierLabel = chefProfile?.tier === ChefTier.CLASSICALLY_TRAINED
    ? 'Classically Trained'
    : 'Home Chef';

  const completedCount = Object.values(stepCompletion).filter(Boolean).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Your Profile</Text>
        <View style={styles.tierBadge}>
          <Text style={styles.tierText}>{tierLabel}</Text>
        </View>
        <Text style={styles.progress}>{completedCount} of 4 steps complete</Text>
      </View>

      <StepCard
        title="Profile Details"
        description="Bio, cuisines, service models, pricing"
        isComplete={stepCompletion.profile}
        onPress={() => navigation.navigate('ProfileSetup')}
      />
      <StepCard
        title="Photos"
        description="Show off your cooking and presentation"
        isComplete={stepCompletion.photos}
        onPress={() => navigation.navigate('PhotoUpload')}
      />
      <StepCard
        title="Menu"
        description="Add dishes with pricing and allergens"
        isComplete={stepCompletion.menu}
        onPress={() => navigation.navigate('MenuSetup')}
      />
      <StepCard
        title="Availability"
        description="Set your weekly schedule"
        isComplete={stepCompletion.availability}
        onPress={() => navigation.navigate('AvailabilitySetup')}
      />

      <TouchableOpacity
        style={[styles.goLiveButton, !canGoLive && styles.goLiveDisabled]}
        onPress={handleGoLive}
        disabled={!canGoLive || isGoingLive}
        activeOpacity={0.7}
      >
        {isGoingLive ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.goLiveText}>
            {chefProfile?.isLive ? 'You\'re Live!' : 'Go Live'}
          </Text>
        )}
      </TouchableOpacity>

      {!canGoLive && (
        <Text style={styles.goLiveHint}>
          Complete all 4 steps to go live
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  tierBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  tierText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  progress: {
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusComplete: {
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statusTextComplete: {
    color: '#fff',
    fontSize: 16,
  },
  goLiveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  goLiveDisabled: {
    backgroundColor: '#94a3b8',
  },
  goLiveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  goLiveHint: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 8,
  },
});
