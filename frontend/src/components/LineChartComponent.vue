<template>
  <div class="chart-container">
    <ResponsiveContainer width="100%" height="300px">
      <LineChart :data="data" margin="{ top: 5, right: 30, left: 20, bottom: 5 }">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#00acc1" activeDot="{ r: 8 }" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</template>

<script>
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
