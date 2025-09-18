import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Slider } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AudioRecording, AudioPlayerState } from "../../types/audio";

interface AudioPlayerProps {
  recording: AudioRecording;
  isVisible: boolean;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  recording,
  isVisible,
  onClose,
}) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: recording.duration,
    playbackRate: 1.0,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setPlayerState((prev) => ({
        ...prev,
        duration: recording.duration,
        currentTime: 0,
      }));
    }
  }, [isVisible, recording.duration]);

  const handlePlayPause = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Simular carregamento do áudio
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }));

      // Simular reprodução (em uma implementação real, você usaria expo-av ou similar)
      if (!playerState.isPlaying) {
        // Iniciar reprodução simulada
        const interval = setInterval(() => {
          setPlayerState((prev) => {
            if (prev.currentTime >= prev.duration) {
              clearInterval(interval);
              return { ...prev, isPlaying: false, currentTime: prev.duration };
            }
            return { ...prev, currentTime: prev.currentTime + 1 };
          });
        }, 1000);

        // Armazenar interval para poder parar
        (window as any).audioInterval = interval;
      } else {
        // Parar reprodução
        if ((window as any).audioInterval) {
          clearInterval((window as any).audioInterval);
        }
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (value: number) => {
    setPlayerState((prev) => ({
      ...prev,
      currentTime: value,
    }));
  };

  const handleSpeedChange = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playerState.playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;

    setPlayerState((prev) => ({
      ...prev,
      playbackRate: speeds[nextIndex],
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.recordingInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {recording.title}
          </Text>
          <Text style={styles.topic} numberOfLines={1}>
            {recording.topic}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(playerState.currentTime)}
          </Text>
          <Text style={styles.timeText}>
            {formatTime(playerState.duration)}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={playerState.duration}
          value={playerState.currentTime}
          onValueChange={handleSeek}
          minimumTrackTintColor="#4F46E5"
          maximumTrackTintColor="#E5E7EB"
          thumbStyle={styles.sliderThumb}
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.speedButton}
          onPress={handleSpeedChange}
          disabled={isLoading}
        >
          <Text style={styles.speedText}>{playerState.playbackRate}x</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isLoading && styles.playButtonDisabled]}
          onPress={handlePlayPause}
          disabled={isLoading}
        >
          <MaterialIcons
            name={playerState.isPlaying ? "pause" : "play-arrow"}
            size={32}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forwardButton}
          onPress={() =>
            handleSeek(
              Math.min(playerState.currentTime + 30, playerState.duration)
            )
          }
          disabled={isLoading}
        >
          <MaterialIcons name="forward-30" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.metadata}>
        <Text style={styles.metadataText}>
          {recording.subject} • {formatTime(recording.duration)}
        </Text>
        <Text style={styles.metadataText}>
          {recording.createdAt.toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recordingInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  topic: {
    fontSize: 14,
    color: "#6B7280",
  },
  closeButton: {
    padding: 4,
  },
  progressSection: {
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#4F46E5",
    width: 16,
    height: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  speedButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 20,
  },
  speedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  playButton: {
    backgroundColor: "#4F46E5",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  forwardButton: {
    padding: 8,
    marginLeft: 20,
  },
  metadata: {
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  metadataText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
});
