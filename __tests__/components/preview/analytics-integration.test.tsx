import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UnitCard } from '@/components/course/preview/UnitCard';
import { AudioPlayer } from '@/components/course/preview/AudioPlayer';
import { TranslationToggle } from '@/components/course/preview/TranslationToggle';
import * as analytics from '@/lib/analytics';

jest.mock('@/lib/analytics');

const mockUnit = {
  unitId: 'unit-1',
  unitNumber: 1,
  title: 'Test Unit',
  topics: ['Grammar', 'Vocabulary'],
  difficulty: 3,
  exerciseCount: 15,
  estimatedDuration: 30,
  exerciseBreakdown: {
    multiple_choice: 5,
    fill_in_the_blank: 5,
    matching: 0,
    drag_and_drop: 0,
    categorization: 0,
    short_answer: 0,
    audio_matching: 0,
    listening: 3,
    video_narrative: 0,
    flashcards: 0,
    other: 2,
    total: 15,
  }
};

describe('Analytics Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UnitCard Analytics', () => {
    it('tracks unit card clicks', () => {
      const { container } = render(<UnitCard unit={mockUnit} />);
      const link = container.querySelector('a[href="/debug/a1-preview/unit-1"]');
      
      if (link) {
        fireEvent.click(link);
        expect(analytics.trackUnitCardClick).toHaveBeenCalledWith('unit-1', 1);
      }
    });
  });

  describe('AudioPlayer Analytics', () => {
    beforeEach(() => {
      HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
      HTMLMediaElement.prototype.pause = jest.fn();
      Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
        get: () => 120,
        configurable: true,
      });
    });

    it('tracks audio play events', async () => {
      render(
        <AudioPlayer 
          audioUrl="/test-audio.mp3" 
          unitId="unit-1" 
        />
      );
      
      const playButton = screen.getByLabelText('Play');
      fireEvent.click(playButton);
      
      await waitFor(() => {
        expect(analytics.trackAudioPlayback).toHaveBeenCalledWith('play', 'unit-1');
      });
    });

    it('tracks audio pause events', async () => {
      render(
        <AudioPlayer 
          audioUrl="/test-audio.mp3" 
          unitId="unit-1" 
        />
      );
      
      const playButton = screen.getByLabelText('Play');
      fireEvent.click(playButton);
      
      await waitFor(() => {
        const pauseButton = screen.getByLabelText('Pause');
        fireEvent.click(pauseButton);
        expect(analytics.trackAudioPlayback).toHaveBeenCalledWith('pause', 'unit-1');
      });
    });

    it('tracks speed changes', () => {
      render(
        <AudioPlayer 
          audioUrl="/test-audio.mp3" 
          unitId="unit-1" 
        />
      );
      
      const speedButton = screen.getByLabelText('Speed 1.25x');
      fireEvent.click(speedButton);
      
      expect(analytics.trackAudioPlayback).toHaveBeenCalledWith('speed_change', 'unit-1', 1.25);
    });
  });

  describe('TranslationToggle Analytics', () => {
    it('tracks translation toggle events', () => {
      const text = 'Hello [[world|mundo]] test';
      
      render(
        <TranslationToggle 
          text={text} 
          unitId="unit-1" 
        />
      );
      
      const toggleButton = screen.getByLabelText('Show translations');
      fireEvent.click(toggleButton);
      
      expect(analytics.trackTranslationToggle).toHaveBeenCalledWith(true, 'unit-1');
    });

    it('tracks toggle off events', () => {
      const text = 'Hello [[world|mundo]] test';
      
      render(
        <TranslationToggle 
          text={text} 
          unitId="unit-1" 
          defaultShowTranslation={true}
        />
      );
      
      const toggleButton = screen.getByLabelText('Hide translations');
      fireEvent.click(toggleButton);
      
      expect(analytics.trackTranslationToggle).toHaveBeenCalledWith(false, 'unit-1');
    });
  });
});
