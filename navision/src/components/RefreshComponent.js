import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, ActivityIndicator, StyleSheet, View } from 'react-native';

const RefreshComponent = ({ children, onRefreshAction, refreshing }) => {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefreshAction} />
      }
    >
      {refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        children
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RefreshComponent;
