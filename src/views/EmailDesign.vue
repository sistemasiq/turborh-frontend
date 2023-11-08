<template>
<q-layout view="hHr lpr lFf">
  <q-page-container>
    <q-page>
    <q-card class="q-mb-md">
      <q-card-section class="bg-primary text-white">
        <p class="q-mb-md">Confirmación de Entrevista</p>
      </q-card-section>
      <q-card-section>
        <p><strong>Asunto:</strong> Confirmación de Entrevista para el Puesto en Turbomaquinas S.A de C.V</p>
        <p><strong>Para:</strong> [Nombre del Candidato]</p>
        <p><strong>Fecha de Entrevista:</strong> [Fecha]</p>
        <p><strong>Hora:</strong> [Hora]</p>
        <p><strong>Modalidad:</strong> Entrevista Virtual</p>
        <p><strong>Nota:</strong> Por favor, asegúrate de que tu entorno esté libre de distracciones durante la entrevista virtual. Utilizaremos la plataforma de videoconferencia Zoom. A continuación, te proporciono el enlace de la reunión: [Enlace de Zoom]</p>
        <p>Estimado [Nombre del Candidato],</p>
        <p>Es un placer confirmar que hemos agendado una entrevista contigo para el puesto en Turbomaquinas S.A de C.V. La entrevista se llevará a cabo de manera virtual el [Fecha] a las [Hora]. Durante esta entrevista, discutiremos tus habilidades y experiencia en relación con el puesto. También tendrás la oportunidad de aprender más sobre nuestra empresa y hacer cualquier pregunta que puedas tener.</p>
        <p>Agradecemos tu interés en unirte a nuestro equipo y esperamos conocerte mejor durante la entrevista virtual. Si tienes alguna pregunta o necesitas más información, no dudes en contactarme.</p>
        <p>Atentamente,</p>
        <p>[Tu Nombre]</p>
        <p>[Tu Cargo]</p>
        <p>Turbomaquinas S.A de C.V</p>
        <p>[Tus Datos de Contacto]</p>
        <q-btn color="primary" class="q-mt-md" @click="entrarReunion">Entrar a la reunión</q-btn>
      </q-card-section>
      <q-card-actions class="q-text-center">
        &copy; 2023 Turbomaquinas S.A de C.V
      </q-card-actions>
    </q-card>
  </q-page>
  </q-page-container>
</q-layout>
</template>

<script setup>
const entrarReunion = () => {
  // Lógica para redirigir al enlace de la reunión
}
</script>
