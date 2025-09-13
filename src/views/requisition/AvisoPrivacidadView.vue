<template>
  <q-page class="privacy-page">
    <div class="row justify-center q-pa-md">
      <div class="col-12 col-lg-10 col-xl-8">
        <q-card class="privacy-card" flat>
          <!-- Header -->
          <q-card-section class="bg-primary text-white q-pa-md">
            <div class="row items-center">
              <div class="col">
                <h4 class="text-h4 q-ma-none text-weight-bold">
                  <q-icon name="privacy_tip" class="q-mr-md" size="md"/>
                  Aviso de Privacidad
                </h4>
                <p class="text-subtitle1 q-mt-sm q-mb-none opacity-90">
                  Consulta los avisos de privacidad para empleados y candidatos
                </p>
              </div>
            </div>
          </q-card-section>

          <!-- Content -->
          <q-card-section class="q-pa-md">
            <!-- Responsable Section -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="business" class="q-mr-sm" color="primary"/>
                Responsable del Tratamiento
              </h5>
              <q-card flat bordered class="info-card">
                <q-card-section>
                  <p class="text-body1 text-justify">
                    Con fundamento en los artículos 15 y 16 de la Ley Federal de Protección de Datos Personales en
                    Posesión de Particulares hacemos de su conocimiento que <strong>Turbomáquinas S.A. de C.V.</strong>, con
                    domicilio en <strong>Boulevard Adolfo López Mateos No. 653 Col. Centro C.P. 59300 en La Piedad,
                    Michoacán</strong> es responsable de recabar sus datos personales, del uso que se le dé a los mismos y
                    de su protección.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Finalidades Section -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="assignment" class="q-mr-sm" color="primary"/>
                Finalidades del Tratamiento
              </h5>
              <p class="text-body1 q-mb-md text-justify">
                Usted es propietario de sus datos e información personal, la cual será utilizada con alguno(s) de
                los siguientes fines:
              </p>
              
              <q-list bordered separator class="rounded-borders">
                <q-item v-for="(finalidad, index) in finalidades" :key="index" class="q-pa-md">
                  <q-item-section avatar>
                    <q-icon :name="finalidad.icon" :color="finalidad.color" size="sm"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-body1 text-justify">{{ finalidad.text }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <!-- Datos Requeridos Section -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="contact_page" class="q-mr-sm" color="primary"/>
                Datos Personales Requeridos
              </h5>
              
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <p class="text-body1 text-justify q-mb-md">
                    Para las finalidades antes mencionadas, requerimos obtener los siguientes datos personales:
                  </p>
                  <div class="text-body2 text-justify" style="line-height: 1.6;">
                    Nombre, apellidos, teléfono (móvil y fijo), fotografía, correo electrónico, dirección, comprobante de
                    domicilio, sexo, RFC, CURP, copia de identificación oficial, IFE, número de pasaporte, estado civil,
                    número de cartilla de servicio militar, clase y número de licencia de manejo, pasatiempo favorito,
                    deporte que practica, si es extranjero documento que le permite trabajar en el País, acta de
                    nacimiento original o copia certificada, estado civil, lugar y fecha de nacimiento, nacionalidad,
                    estudio socioeconómico, prueba especial psicométrica, nombre y parentesco de las personas con
                    las que habita, nombre y parentesco de sus dependientes económicos, nombre, ocupación y
                    edades del padre y madre, acta de matrimonio original o copia certificada, nombre y edades del
                    cónyuge e hijos, familiares dentro de la empresa, grado de estudios, institución, carrera/área,
                    manejo de idiomas, comprobante de estudios, experiencia laboral, conocimientos y habilidades,
                    responsabilidad, asistencia y puntualidad, relaciones laborales, preferencias laborales, puesto,
                    nombre, razón o denominación social, domicilio, periodo laborado, motivo de terminación de la
                    relación laboral y teléfono (móvil y fijo) de la empresa en la que actualmente labora o en las que
                    laboró, cartas de recomendación laborales y personales, número de clínica del IMSS que le
                    proporciona servicio, sueldo, incumplimientos, sanciones, faltas, asistencias, tiempos extras,
                    prestaciones, deducciones, jefe inmediato, ocupación actual, ingreso mensual, usuario de
                    Facebook, usuario de Twitter, usuario de Linkedin, número de nómina, número de tarjeta de
                    nómina.
                  </div>
                </q-card-section>
              </q-card>

              <!-- Datos Sensibles Alert -->
              <q-banner class="bg-orange-1 text-orange-9" rounded>
                <template v-slot:avatar>
                  <q-icon name="warning" color="orange" size="md"/>
                </template>
                <div class="text-body2 text-justify">
                  <strong>Datos Personales Sensibles:</strong> El Responsable tratará los siguientes datos personales sensibles: 
                  discapacidades, tipo de discapacidad, estado de salud, estudios médicos, estatura, peso, talla, enfermedades o
                  padecimientos, tipo de sangre, tratamientos médicos, lesiones o accidentes, afiliación a algún
                  sindicato, participación en procesos o problemas judiciales, club social o deportivo.
                </div>
              </q-banner>
            </div>

            <!-- Recolección de Datos -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="data_usage" class="q-mr-sm" color="primary"/>
                Recolección de Datos
              </h5>
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify">
                    En caso de no contar con sus datos personales no estaríamos en posibilidad de llevar a cabo los
                    fines para los cuales se requieren, por lo que Turbomáquinas no tendría ningún tipo de
                    responsabilidad derivado de ello.
                  </p>
                  <q-separator class="q-my-md"/>
                  <p class="text-body2 text-justify">
                    Para la recolección de datos personales, seguimos todos los principios que marca la Ley como la
                    licitud, calidad, consentimiento, información, finalidad, lealtad, proporcionalidad y responsabilidad.
                  </p>
                  <q-separator class="q-my-md"/>
                  <p class="text-body2 text-justify">
                    Los datos personales serán recabados directamente del titular de forma personal o a través de
                    otros medios ópticos, sonoros, visuales, o por cualquier otra tecnología legalmente permitida, ya
                    sea mediante solicitudes, currículos, entrevistas, estudios socio-económicos, evaluaciones
                    médicas, y psicométricas, en nuestra página de internet o servicios en línea, etc.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Cookies Section -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="cookie" class="q-mr-sm" color="primary"/>
                Uso de Cookies y Sitios Web
              </h5>
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify">
                    La información que recibimos y almacenamos de nuestras páginas de internet cuando usted
                    interactúa en nuestros sitios web, es principalmente información técnica como su dirección de
                    protocolo de internet, su sistema operativo en la computadora y su tipo de navegador, la dirección
                    de un sitio web de referencia, en su caso, y la ruta que siga durante su recorrido por nuestra
                    página web. Usamos "cookies" para reconocerlo cuando utilice o regrese a nuestros sitios.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Derechos ARCO -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="security" class="q-mr-sm" color="primary"/>
                Sus Derechos (ARCO)
              </h5>
              
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify q-mb-md">
                    Es importante informarle que usted tiene derecho al <strong>Acceso, Rectificación y Cancelación</strong> de sus
                    datos personales, a <strong>Oponerse</strong> al tratamiento de los mismos o a revocar el consentimiento que para
                    dicho fin nos haya otorgado.
                  </p>
                  
                  <div class="row q-gutter-md q-mt-md">
                    <div class="col-12 col-sm-6 col-md-3" v-for="derecho in derechosARCO" :key="derecho.title">
                      <q-card flat bordered class="full-height derecho-card text-center">
                        <q-card-section>
                          <q-icon :name="derecho.icon" :color="derecho.color" size="sm" class="q-mb-sm"/>
                          <div class="text-subtitle2 text-weight-bold">{{ derecho.title }}</div>
                          <div class="text-caption">{{ derecho.description }}</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Contacto Section -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="contact_support" class="q-mr-sm" color="primary"/>
                Contacto para Ejercer sus Derechos
              </h5>
              
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify q-mb-md">
                    Para ello, es necesario que envíe la solicitud en los términos que marca la Ley en su Art. 29 a
                    nuestro Departamento de Datos Personales:
                  </p>
                  
                  <div class="row q-gutter-md">
                    <div class="col-12 col-md-4">
                        <div class="text-center full-width">
                          <div class="text-weight-bold text-caption">Dirección</div>
                          <div class="text-caption">Blvd. Adolfo López Mateos No. 653, Col. Centro, La Piedad, Michoacán C.P. 59300</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="text-center full-width">
                          <div class="text-weight-bold text-caption">Teléfono</div>
                          <div class="text-caption">352 522 0820</div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="text-center full-width">
                          <div class="text-weight-bold text-caption">Email</div>
                          <div class="text-caption">recursoshumanos@turbomaquinas.com</div>
                        </div>
                    </div>
                  </div>
                  
                  <p class="text-caption text-justify q-mt-md">
                    Solicitamos confirme vía telefónica para garantizar su correcta recepción. Tendremos un plazo máximo de 20 días hábiles para informarle sobre la procedencia de la misma y si resulta procedente, se haga efectiva la misma dentro de los quince días hábiles siguientes.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Limitaciones Cancelación -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="info" class="q-mr-sm" color="primary"/>
                Limitaciones para la Cancelación
              </h5>
              <q-banner class="bg-blue-1 text-blue-9" rounded>
                <template v-slot:avatar>
                  <q-icon name="info" color="blue" size="md"/>
                </template>
                <div class="text-body2 text-justify">
                  Turbomáquinas no estará obligado a cancelar los datos personales cuando se trate de alguno de
                  los supuestos establecidos en la Ley, entre otras: contratos privados, sociales o administrativos;
                  disposiciones legales; actuaciones judiciales o administrativas; obligaciones fiscales; investigación
                  y persecución de delitos; intereses jurídicamente tutelados del titular; interés público; o
                  cumplimiento de obligaciones legalmente adquiridas.
                </div>
              </q-banner>
            </div>

            <!-- Transferencias -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="share" class="q-mr-sm" color="primary"/>
                Transferencia de Datos
              </h5>
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify">
                    Los datos personales jamás serán divulgados ni compartidos con terceros, en el entendido de que
                    no se considera como tercero a las empresas que formen parte del mismo grupo de
                    Turbomáquinas que requieran tener los datos personales para los fines antes mencionados. La
                    única transferencia de datos a terceros será en todo caso para dar cumplimiento a obligaciones
                    legales laborales, fiscales y/o seguridad social que deriven de la relación laboral con el titular de los
                    datos personales.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Consentimiento -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="how_to_reg" class="q-mr-sm" color="primary"/>
                Consentimiento
              </h5>
              <q-card flat bordered class="consent-info">
                <q-card-section>
                  <p class="text-body2 text-justify q-mb-md">
                    Por lo tanto, el titular al dar su consentimiento a este Aviso de Privacidad, o bien al no oponerse de
                    forma manifiesta dentro del plazo de <strong>15 (quince) días</strong> a partir de que tenga conocimiento del mismo
                    acepta que sus datos personales sean tratados para las finalidades antes señaladas.
                  </p>
                  <q-separator class="q-my-md"/>
                  <p class="text-body2 text-justify">
                    El titular de los datos personales podrá revocar su consentimiento para el tratamiento de datos
                    personales en cualquier momento, debiendo, únicamente para tales efectos, enviar una solicitud
                    por escrito por mensajería al domicilio o al correo electrónico mencionado más arriba en el
                    presente Aviso.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Modificaciones -->
            <div class="privacy-section">
              <h5 class="section-title">
                <q-icon name="update" class="q-mr-sm" color="primary"/>
                Modificaciones al Aviso
              </h5>
              <q-card flat bordered>
                <q-card-section>
                  <p class="text-body2 text-justify">
                    Nos reservamos el derecho de cambiar este Aviso de Privacidad en cualquier momento. Las
                    modificaciones estarán disponibles en cualquiera de los siguientes medios: anuncios visibles en
                    nuestras instalaciones en los tableros de avisos, en nuestra página de internet, o se las haremos
                    llegar al último correo electrónico que nos haya proporcionado.
                  </p>
                  <p class="text-body2 text-justify q-mt-md">
                    No seremos responsables si usted no recibe la notificación de cambio en el Aviso de Privacidad si
                    existiere algún problema con su cuenta de correo electrónico o de transmisión de datos por
                    internet.
                  </p>
                </q-card-section>
              </q-card>
            </div>

            <!-- Footer -->
            <q-separator class="q-my-xl"/>
            <div class="text-center">
              <q-chip color="grey-3" text-color="grey-8" icon="update" class="q-pa-md">
                Fecha de la última actualización: 15 de Julio de 2016
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const finalidades = [
  {
    text: 'Registrar su solicitud de empleo, para participar en nuestra cartera de candidatos para algún puesto vacante.',
    icon: 'work',
    color: 'blue'
  },
  {
    text: 'Participar en los procesos de selección y contratación, contestando evaluaciones psicométricas, técnicas y siendo entrevistado.',
    icon: 'psychology',
    color: 'green'
  },
  {
    text: 'En su caso la elaboración de Contrato Laboral.',
    icon: 'description',
    color: 'orange'
  },
  {
    text: 'El cumplimiento de obligaciones legales, fiscales, laborales, seguridad social, entre otras que deriven de la relación laboral.',
    icon: 'gavel',
    color: 'purple'
  },
  {
    text: 'Administrar su trayectoria laboral dentro de la empresa.',
    icon: 'trending_up',
    color: 'teal'
  },
  {
    text: 'Participar en algún proceso relacionado con su capacitación y desarrollo profesional.',
    icon: 'school',
    color: 'indigo'
  },
  {
    text: 'Participar en alguna encuesta o sondeo del clima laboral o de algún servicio proporcionado por la empresa.',
    icon: 'poll',
    color: 'pink'
  },
  {
    text: 'Potenciales procesos administrativos o judiciales que involucren al titular de los datos personales.',
    icon: 'account_balance',
    color: 'red'
  },
  {
    text: 'Y en general, para dar cumplimiento a las obligaciones y derechos derivados de la relación laboral entre usted y la empresa.',
    icon: 'handshake',
    color: 'cyan'
  }
]

const derechosARCO = [
  {
    title: 'Acceso',
    description: 'Conocer qué datos personales tenemos',
    icon: 'visibility',
    color: 'blue'
  },
  {
    title: 'Rectificación',
    description: 'Solicitar corrección de datos',
    icon: 'edit',
    color: 'green'
  },
  {
    title: 'Cancelación',
    description: 'Solicitar eliminación de datos',
    icon: 'delete',
    color: 'red'
  },
  {
    title: 'Oposición',
    description: 'Oponerse al tratamiento',
    icon: 'block',
    color: 'orange'
  }
]
</script>

<style scoped>
.privacy-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.privacy-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.privacy-section {
  margin-bottom: 2rem;
}

.section-title {
  color: #1976d2;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
  display: flex;
  align-items: center;
}

.info-card {
  border-left: 4px solid #1976d2;
  background: #fafafa;
}

.derecho-card {
  border-left: 3px solid #1976d2;
  transition: transform 0.2s ease;
}

.derecho-card:hover {
  transform: translateY(-2px);
}

.consent-info {
  border: 2px solid #4caf50;
  background: #f1f8e9;
}

.text-justify {
  text-align: justify;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .privacy-card {
    margin: 0.5rem;
    border-radius: 12px;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .q-pa-xl {
    padding: 1rem !important;
  }
}
</style>